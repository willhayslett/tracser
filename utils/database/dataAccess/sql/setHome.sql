INSERT INTO HOME 
  ( 
    MLS_NUMBER, ADDRESS, CITY, ZIP, SUBDIVISION,SQUARE_FOOTAGE,
    BEDS, FULL_BATHS, HALF_BATHS, PRICE, DAYS_ON_MARKET, DESCRIPTION,
    REALTRACS_IMAGE_LINK, REALTRACS_LINK
  )
VALUES 
  ( 
    $mlsNumber, $address, $city, $zip, $subdivision, $squareFootage,
    $numberOfBeds, $fullBaths, $halfBaths, $price, $daysOnMarket, $description,
    $realTracsImageLink, $realTracsLink
  );