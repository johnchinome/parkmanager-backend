-- CreateTable
CREATE TABLE "UserParkingLotAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "parkingLotId" INTEGER NOT NULL,

    CONSTRAINT "UserParkingLotAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserParkingLotAccess" ADD CONSTRAINT "UserParkingLotAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParkingLotAccess" ADD CONSTRAINT "UserParkingLotAccess_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "ParkingLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
