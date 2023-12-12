# vault-file-replacer

파일 내의 임의의 문자열을 Vault에서 받아온 정보로 대체하는 방식의 변환 프로그램

## 사용법

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