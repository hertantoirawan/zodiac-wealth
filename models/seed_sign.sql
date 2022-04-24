DELETE FROM sign;
DELETE FROM sign_type;

INSERT INTO sign_type (name) VALUES ('Western'), ('Chinese');

INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Aries', 3, 21, 4, 19);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Taurus', 4, 20, 5, 20);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Gemini', 5, 21, 6, 21);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Cancer', 6, 22, 7, 22);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Leo', 7, 23, 8, 22);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Virgo', 8, 23, 9, 22);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Libra', 9, 23, 10, 22);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Scorpio', 10, 23, 11, 22);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Sagittarius', 11, 23, 12, 21);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Capricorn', 12, 22, 1, 19);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Aquarius', 1, 20, 2, 18);
INSERT INTO sign (type_id, name, start_month, start_day, end_month, end_day) VALUES (1, 'Pisces', 2, 19, 3, 20);
