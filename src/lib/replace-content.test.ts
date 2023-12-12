import { replaceContent } from "./replace-content";

describe("replaceContent", () => {
    it("replaceContent", () => {
        // given
        const str = `$db['default']['hostname'] = 'testhostname';
$db['default']['username'] = 'test';
$db['default']['password'] = '%karsei.mysql.userdb.hostname%';
$db['default']['dbdriver'] = '%karsei.mysql.userdb.password%';
$db['default']['dbprefix'] = '';`;
        const mappings = {
            "karsei.mysql.userdb.hostname": "thisishostname",
            "karsei.mysql.userdb.password": "thisispassword",
        };

        // when
        const content = replaceContent(str, mappings);

        // then
        expect(content).toEqual(`$db['default']['hostname'] = 'testhostname';
$db['default']['username'] = 'test';
$db['default']['password'] = 'thisishostname';
$db['default']['dbdriver'] = 'thisispassword';
$db['default']['dbprefix'] = '';`);
    });

    it("replaceContentContinuous", () => {
        // given
        const str = `$db['default']['hostname'] = 'testhostname';
$db['default']['username'] = 'test';
$db['default']['password'] = '%karsei.mysql.userdb.hostname%';
$db['default']['dbdriver'] = '%karsei.mysql.userdb.password%';
$db['default']['dbprefix'] = '';`;
        const mappings = {
            "karsei.mysql.userdb.hostname": "thisishostname",
        };

        // when
        const content = replaceContent(str, mappings);

        // then
        expect(content).toEqual(`$db['default']['hostname'] = 'testhostname';
$db['default']['username'] = 'test';
$db['default']['password'] = 'thisishostname';
$db['default']['dbdriver'] = '%karsei.mysql.userdb.password%';
$db['default']['dbprefix'] = '';`);
    });
});
