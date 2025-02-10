-- Creating tables --------------------------------------
CREATE TABLE LocationOfOperation (
State varchar (255)  NOT NULL,
TimeOfDay varchar (255),
Landmark varchar (255),
City varchar (255),
LevelOfPrivacy int,

-- defining PKs, FKs
PRIMARY KEY (State)
);

CREATE TABLE Weapon (
Type varchar (255) NOT NULL,
WRange varchar (255),
Effectiveness int,
ResultingKillMethod varchar (255),

-- defining PKs
PRIMARY KEY (Type)
);

CREATE TABLE MindGames (
Technique varchar (255) NOT NULL,
RiskFactor int,
Duration int,

-- defining PKs
PRIMARY KEY (Technique)
);

CREATE TABLE Communication (
Anonymity varchar (255) NOT NULL,
Frequency varchar (255),
CommunicationMedium varchar (255),

-- defining PKs
PRIMARY KEY (Anonymity)
);

CREATE TABLE Timeline (
FinalDueDate date,
TimeRange varchar (255),
TBonus varchar (255),

-- defining PKs
PRIMARY KEY (FinalDueDate)

);

CREATE TABLE Payment (
DebtSpecific varchar (255) NOT NULL,
PriceRange double,
PBonus varchar (255),

-- defining PKs
PRIMARY KEY (DebtSpecific)

);

CREATE TABLE Client (
CUserID varchar (255) NOT NULL,
CPassword varchar (255) NOT NULL,
Alias varchar (255),	
Motive varchar (255),
CWeaponType varchar (255),
CTechnique varchar (255),
CDebtSpecification varchar (255),
CAnonymity varchar (255),
CFinalDueDate date,
CState varchar (255),

-- defining PKs, FKs
PRIMARY KEY (CUserID),
FOREIGN KEY (CWeaponType) REFERENCES Weapon(Type),
FOREIGN KEY (CTechnique) REFERENCES MindGames (Technique),
FOREIGN KEY (CDebtSpecification) REFERENCES Payment(DebtSpecific),
FOREIGN KEY (CAnonymity) REFERENCES Communication(Anonymity),
FOREIGN KEY (CFinalDueDate) REFERENCES Timeline(FinalDueDate) ,
FOREIGN KEY (CState)REFERENCES LocationOfOperation (State)
);

CREATE TABLE Hitman (
  HUserID varchar(255) NOT NULL,
  CodeName varchar(255),
  HPassword varchar(512) NOT NULL,
  HDebtSpecification varchar(255),
  HState varchar(255),
  HWeapon varchar(255),
  CUserID varchar (255),
  HPsychTechnique varchar(255),
  HCommunication varchar(255),
  

  PRIMARY KEY (HUserID),
  FOREIGN KEY (CUserID) REFERENCES Client(CUserID),
  FOREIGN KEY (HDebtSpecification) REFERENCES Payment(DebtSpecific),
  FOREIGN KEY (HState) REFERENCES LocationOfOperation(State),
  FOREIGN KEY (HWeapon) REFERENCES Weapon(Type),
  FOREIGN KEY (HPsychTechnique) REFERENCES MindGames(Technique),
  FOREIGN KEY (HCommunication) REFERENCES Communication(Anonymity)

);


CREATE TABLE Target (
TName varchar (255) NOT NULL,	
TAddress varchar (255) NOT NULL,
TAge int NOT NULL,
TThreatLevel int NOT NULL,
THeight int NOT NULL,
TApproxWeight int NOT NULL,
TEyeColour varchar (255) NOT NULL,
THairColour varchar (255) NOT NULL,
CUserID varchar (255) NOT NULL,

-- defining FK 
FOREIGN KEY (CUserID) REFERENCES Client(CUserID)

);

--DUMMY DATA

INSERT INTO LocationOfOperation (State, TimeOfDay, Landmark, City, LevelOfPrivacy)
VALUES
('California', 'Day', 'Golden Gate Bridge', 'San Francisco', 5),
('New York', 'Night', 'Statue of Liberty', 'New York City', 3),
('Texas', 'Morning', 'Alamo', 'San Antonio', 4),
('Nevada', 'Evening', 'Las Vegas Strip', 'Las Vegas', 2),
('Florida', 'Afternoon', 'Disney World', 'Orlando', 4),
('Ontario', 'Day', 'CN Tower', 'Toronto', 5),
('British Columbia', 'Morning', 'Stanley Park', 'Vancouver', 4),
('Quebec', 'Night', 'Old Quebec City', 'Quebec City', 3),
('Alberta', 'Afternoon', 'Banff National Park', 'Banff', 4),
('Nova Scotia', 'Evening', 'Peggy\'s Cove Lighthouse', 'Halifax', 2);

INSERT INTO Weapon (Type, WRange, Effectiveness, ResultingKillMethod)
VALUES
  ('Pistol', 'Short', 80, 'Gunshot'),
  ('Rifle', 'Long', 95, 'Gunshot'),
  ('Knife', 'Close', 50, 'Stabbing'),
  ('Poison', 'None', 70, 'Poisoning'),
  ('Axe', 'Close', 60, 'Blunt Force'),
  ('Explosive', 'None', 100,'Explosion');
  
 
SELECT * FROM Hitman;
SELECT * FROM client;
SELECT * FROM target;

INSERT INTO MindGames (Technique, RiskFactor, Duration)
VALUES
('The "Silent Treatment"', 2, 100),          -- RiskFactor 2, Duration 100 hours (ignoring the target for a long period)
('The "Reverse Psychology Master" Trick', 4, 48),  -- RiskFactor 4, Duration 48 hours (using reverse psychology to confuse the target)
('The "Nice Guy" Act', 2, 60);                -- RiskFactor 2, Duration 60 hours (playing the overly kind character before revealing a twist)


INSERT INTO Communication (Anonymity, Frequency, CommunicationMedium)
VALUES
('Anonymous', 'Daily', 'Encrypted Email'),
('Known', 'Weekly', 'Phone Call'),
('Disguised', 'Bi-Weekly', 'Secure Messaging App'),
('Direct', 'Once', 'Face-to-Face'),
('Indirect', 'Monthly', 'Postal Mail');


INSERT INTO Payment (DebtSpecific, PriceRange, PBonus)
VALUES
    ('25% Up Front', 100.00, 'Urgency Bonus'),
    ('50% Up Front', 500.00, 'Quick Response Bonus'),
    ('75% Up Front', 1000.00, 'Standard Completion Bonus'),
    ('Custom Agreement Loan Repayment', NULL, 'Custom Bonus'),
    ('One-Time Payment', 300.00, 'Express Service Bonus');

INSERT INTO Timeline (FinalDueDate, TimeRange, TBonus)
VALUES
('2024-01-01', '24 hours', 'Urgency Bonus'),
('2024-02-01', '1-2 weeks', 'Quick Response Bonus'),
('2024-03-01', '1 month', 'Standard Completion Bonus'),
('2024-06-01', '3-6 months', 'Custom Bonus'),
('2025-01-01', '1 year', 'Custom Bonus');

INSERT INTO Hitman (HUserID, CodeName, HPassword, HDebtSpecification, HState, CUserID)
VALUES 
('hitman1', 'Shadow', 'password123', '25% Up Front', 'California', null),
('hitman2', 'Viper', 'password456', '50% Up Front', 'New York', null),
('hitman3', 'Phoenix', 'password789', '75% Up Front', 'Texas', null); 

select * from client; 
SELECT * FROM Client WHERE CUserID = 'hi';


DELETE FROM Payment
WHERE DebtSpecific = 'Debt1'
-- WHERE PBonus = 'Bonus1
