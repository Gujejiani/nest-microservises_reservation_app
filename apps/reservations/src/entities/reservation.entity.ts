import { AbstractEntity } from "@app/common/database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class ReservationEntity extends AbstractEntity<ReservationEntity> {
    @Column()
    timeStamp: Date;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    userId: number;

  

    @Column()
    invoiceId: string;
}


// export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument);
