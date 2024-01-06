# vault-file-replacer

## 소개

파일 내의 임의의 문자열을 Vault에서 받아온 Secert 정보로 내용을 대체하는 방식의 변환 프로그램입니다. 자동화 배포 시 코드에 민감 정보를 남기지 않고 CI/CD 단계에서 테스트하거나 배포하기 위해 개발되었습니다.

## 사용법

현재 공식 npm repository 에 배포되어 있지 않으므로 아래에서는 사용하는 방법만 설명합니다.

private npm repository 에서 배포하여 사용할 경우, `package.json` 에서 라이브러리 설치 후 `node_modules/.bin/` 에서 직접 실행하는 방식으로 진행할 수 있습니다.

### 설치 

```shell
$ npm ci

$ npm run build
```

### 실행

맵핑 파일이 필요하며 아래와 같은 형식으로 작성합니다.

```json
// ex) vault-mapper.json
{
  "entries": [
    {
      "path": "some/secret", // Secret 경로
      "mapping": {
        // "Vault Secret 데이터 내 키": "입력 파일 내에서 변환될 문자열"
        "hostname": "karsei.mysql.userdb.hostname",
        "port": "karsei.mysql.userdb.port",
        "user": "karsei.mysql.userdb.username",
        "password": "karsei.mysql.userdb.password"
      }
    },
    ...
  ]
}
```

예를 들어 위의 맵핑 정보을 사용하고 아래의 내용이 담긴 파일을 `-i` 옵션을 주어 본 프로그램을 이용할 때

```php
$db['default']['hostname'] = '%karsei.mysql.userdb.hostname%';
```

위 내용은

```php
$db['default']['hostname'] = 'some/secret Secret 경로 내 hostname 키의 값';
```

으로 대체됩니다.

아래 파라미터를 참고하시고 적절하게 입력하셔서 사용하시면 됩니다. (전부 필수)


| 옵션                 | 설명         | 기본값                      |
|--------------------|------------|--------------------------|
| -h (--host)        | Vault Host |                          |
| -rid (--role-id)   | role id    | 환경 변수(VAULT_ROLE_ID)     |
| -sid (--secret-id) | secret id  | 환경 변수(VAULT_SECRET_ID)   |
| -e (--engine-name) | engine 이름  | 환경 변수(VAULT_ENGINE_NAME) |
| -m (--mapper-path) | 맵핑 파일 경로   |                          |
| -i (--input-path)  | 변환할 파일 경로  |                          |
| -o (--output-path) | 출력될 파일 경로  |                          |

```shell
$ cd bin/

$ node app \
  -rid *********** \
  -sid *********** \
  -e *********** \
  -m ../vault-mapper.json \
  -i ../database.php \
  -o ../output.php
```
