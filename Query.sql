-- Dumping structure for table gcdl.branches
CREATE TABLE IF NOT EXISTS `branches` (
  `Branch_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Location` varchar(50) NOT NULL,
  PRIMARY KEY (`Branch_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- (Other tables below...)

-- Dumping structure for table gcdl.dealers
CREATE TABLE IF NOT EXISTS `dealers` (
  `Dealer_ID` int NOT NULL AUTO_INCREMENT,
  `Name` int NOT NULL,
  `Contact` int NOT NULL,
  `Type` int NOT NULL,
  PRIMARY KEY (`Dealer_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping structure for table gcdl.procurement (Your main target table)
CREATE TABLE IF NOT EXISTS `procurement` (
  `Proc_ID` int NOT NULL AUTO_INCREMENT,
  `Producer_ID` int NOT NULL,
  `Cost_per_ton` varchar(50) NOT NULL,
  `Dealer_ID` int NOT NULL,
  `Branch_ID` int NOT NULL,
  `Type` varchar(50) NOT NULL,
  PRIMARY KEY (`Proc_ID`),
  KEY `FK_procurement_dealers` (`Dealer_ID`),
  KEY `FK_procurement_branches` (`Branch_ID`),
  CONSTRAINT `FK_procurement_branches` FOREIGN KEY (`Branch_ID`) REFERENCES `branches` (`Branch_ID`) ON UPDATE RESTRICT,
  CONSTRAINT `FK_procurement_dealers` FOREIGN KEY (`Dealer_ID`) REFERENCES `dealers` (`Dealer_ID`) ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping structure for table gcdl.stock (The table you need to update)
CREATE TABLE IF NOT EXISTS `stock` (
  `Stock_ID` int NOT NULL AUTO_INCREMENT,
  `Produce_ID` int NOT NULL,
  `Branch_ID` int NOT NULL,
  `Last_update` varchar(50) NOT NULL,
  PRIMARY KEY (`Stock_ID`),
  KEY `FK_stock_produce` (`Produce_ID`),
  KEY `FK_stock_branches` (`Branch_ID`),
  CONSTRAINT `FK_stock_branches` FOREIGN KEY (`Branch_ID`) REFERENCES `branches` (`Branch_ID`) ON UPDATE RESTRICT,
  CONSTRAINT `FK_stock_produce` FOREIGN KEY (`Produce_ID`) REFERENCES `produce` (`Produce_ID`) ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- (The file contains additional CREATE TABLE statements for `credit sales`, `produce`, `sales`, and `users` as well).