how many entries in the table

SELECT COUNT(*) FROM festo_round_cylinder;



how many different Stroke in the table
SELECT COUNT(DISTINCT Stroke) FROM festo_round_cylinder;


list all the different stroke 
SELECT DISTINCT Stroke FROM festo_round_cylinder;


how many entries with a stroke of 25mm
SELECT COUNT(*) FROM festo_round_cylinder WHERE Stroke = '25 mm';


list all the entries with a stroke of 25 mm
SELECT * FROM festo_round_cylinder WHERE Stroke = '25 mm';


list the OrderCode of all the entries with a stroke of 25 mm
SELECT OrderCode FROM festo_round_cylinder WHERE Stroke = '25 mm';


what is the OperatingPressureBar of these entries

SELECT OperatingPressureBar FROM festo_round_cylinder WHERE Stroke = '25 mm';


list the OrderCode of all the entries with a stroke of 25 mm and OperatingPressureBar of  1.5 bar ... 10 bar
SELECT OrderCode FROM festo_round_cylinder WHERE Stroke = '25 mm' AND OperatingPressureBar = '1.5 bar ... 10 bar';


give me the product link of the product which have a order code of  DSNU-S-12-25-P-A-MQ

SELECT ProductLink FROM festo_round_cylinder WHERE OrderCode = 'DSNU-S-12-25-P-A-MQ';



show me the manul

SELECT MannualLink FROM festo_round_cylinder WHERE OrderCode = 'DSNU-S-12-25-P-A-MQ';
