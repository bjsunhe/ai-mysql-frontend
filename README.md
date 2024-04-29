show the manual of DSNU-S-8-25-P-A-MQ
MannualLink: https://www.festo.com/media/pim/046/D15000100152046.PDF
list the OrderCode of all the entries with a stroke of 25 mm
OrderCode: DSNU-S-12-25-P-A-MQ
OrderCode: DSNU-S-16-25-P-A-MQ
OrderCode: DSNU-S-16-25-PPS-A-MQ
OrderCode: DSNU-S-20-25-P-A-MX
OrderCode: DSNU-S-20-25-PPS-A-MX
OrderCode: DSNU-S-25-25-P-A-MX
OrderCode: DSNU-S-25-25-PPS-A-MX
OrderCode: DSNU-S-8-25-P-A-MQ
how many entries with a stroke of 25mm
COUNT(*): 8
list all the different stroke 
Stroke: 15 mm
Stroke: 100 mm
Stroke: 1 mm ... 150 mm
Stroke: 10 mm
Stroke: 150 mm
Stroke: 25 mm
Stroke: 125 mm
Stroke: 20 mm
Stroke: 40 mm
Stroke: 30 mm
Stroke: 50 mm
Stroke: 1 mm ... 200 mm
Stroke: 60 mm
Stroke: 80 mm
Stroke: 200 mm
Stroke: 1 mm ... 100 mm
how many different Stroke 
COUNT(DISTINCT Stroke): 16
how many entries in the table
COUNT(*): 96


how many entries in the table

SELECT COUNT(*) FROM festo_round_cylinder;

how many attributes round cylinder have



how many different Stroke in the table
SELECT COUNT(DISTINCT Stroke) FROM festo_round_cylinder;


list all the different stroke 
SELECT DISTINCT Stroke FROM festo_round_cylinder;


how many entries with a stroke of 25mm
SELECT COUNT(*) FROM festo_round_cylinder WHERE Stroke = '25 mm';




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
