
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateAttendanceDto {

    @IsDate()
    date: Date;


    @IsNotEmpty()
    employee: string;
}
