export interface ProgramOptions {
    // Vault HOST
    host: string;
    // Vault ROLE-ID
    roleId: string;
    // Vault SECRET-ID
    secretId: string;
    // Vault ENGINE NAME
    engineName: string;
    // Vault MAPPER PATH
    mapperPath: string;
    // INPUT PATH
    inputPath: string;
    // OUTPUT PATH
    outputPath: string;
}

export interface MapperJson {
    entries: MapperJsonEntry[];
}

export interface MapperJsonEntry {
    path: string;
    mapping: MapperJsonEntryMapping;
}

export interface MapperJsonEntryMapping {
    [index: string]: string;
}
