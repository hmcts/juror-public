--
-- Settings
INSERT INTO JUROR_DIGITAL.APP_SETTINGS (SETTING,VALUE) VALUES ('URGENCY_DAYS','10');
INSERT INTO JUROR_DIGITAL.APP_SETTINGS (SETTING,VALUE) VALUES ('SLA_OVERDUE_DAYS','5');
INSERT INTO JUROR_DIGITAL.APP_SETTINGS (SETTING,VALUE) VALUES ('bureauOfficerSearchResultLimit','100');
INSERT INTO JUROR_DIGITAL.APP_SETTINGS (SETTING,VALUE) VALUES ('teamLeaderSearchResultLimit','200');
--
-- Court whitelist
INSERT INTO JUROR_DIGITAL.COURT_WHITELIST (LOC_CODE) VALUES ('448');

-- Bureau Auth
INSERT into JUROR.PASSWORD (OWNER, LOGIN, PASSWORD, LAST_USED, USER_LEVEL, ARAMIS_AUTH_CODE, ARAMIS_MAX_AUTH, PASSWORD_CHANGED_DATE, LOGIN_ENABLED_YN) values (400, 'samanthak', '5baa61e4c9b93f3f', (select sysdate from dual) - 3, 1, 123456789, 12345678.12, (select sysdate from dual) - 3, 'Y');
