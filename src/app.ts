#!/usr/bin/env node
import * as fs from "fs";
import * as Commander from "commander";
import { MapperJson, ProgramOptions } from "./types";
import Vault from "./lib/vault";
import { replaceContent } from "./lib/replace-content";

// 필요 파라미터
const program = new Commander.Command();
program
    .requiredOption("-h --host <host>", "Vault 호스트 입력")
    .requiredOption("-rid --role-id <role-id>", "Vault Role ID 입력", process.env.VAULT_ROLE_ID)
    .requiredOption("-sid --secret-id <secret-id>", "Vault Secret ID 입력", process.env.VAULT_SECRET_ID)
    .requiredOption("-e --engine-name <engine-name>", "Vault Engine 이름 입력", process.env.VAULT_ENGINE_NAME)
    .requiredOption("-m --mapper-path <mapper-path>", "Vault 맵핑 파일 경로 입력")
    .requiredOption("-i --input-path <input-path>", "변환할 파일 경로 입력")
    .requiredOption("-o --output-path <output-path>", "출력할 파일 경로 입력");
// 검증
program.parse();

const options = program.opts();
const args: ProgramOptions = {
    host: options.host,
    roleId: options.roleId,
    secretId: options.secretId,
    engineName: options.engineName,
    mapperPath: options.mapperPath,
    inputPath: options.inputPath,
    outputPath: options.outputPath,
};

// Vault 초기화
const vault = new Vault(args.host, args.engineName);

async function retrieveSecretData() {
    const mappings: { [index: string]: string } = {};

    const mapperJson: MapperJson = JSON.parse(fs.readFileSync(args.mapperPath, "utf8"));
    for (const entry of mapperJson.entries) {
        const vaultData = await vault.getData(args.roleId, args.secretId, entry.path);

        const mappingKey = Object.keys(entry.mapping);
        for (const secretKey of mappingKey) {
            if (!vaultData.hasOwnProperty(secretKey)) {
                console.warn(`Secret '${entry.path}'에 있는 속성 '${secretKey}'은(는) 찾을 수 없어 건너뜁니다...`);
                continue;
            }
            const replaceStr = entry.mapping[secretKey];
            mappings[replaceStr] = vaultData[secretKey];
            console.log(`Mapping '${replaceStr}' Success!`);
        }
    }
    return mappings;
}

retrieveSecretData().then((mappings) => {
    fs.writeFileSync(args.outputPath, replaceContent(fs.readFileSync(args.inputPath, "utf8"), mappings), "utf8");
});
