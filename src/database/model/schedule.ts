import { Document, Model, Schema, SchemaTypes, Types } from "mongoose";

interface Schedule extends Document {
  readonly user: Types.ObjectId;
  readonly service: Types.ObjectId;
  readonly timeServe: Date;
}

type ScheduleModel = Model<Schedule>;

const ScheduleSchema = new Schema({
  user: { type: SchemaTypes.ObjectId, ref: "User" },
  service: {type: SchemaTypes.ObjectId, ref: "Service" },
  timeServe: SchemaTypes.Date
}, { timestamps: true });
export { Schedule, ScheduleModel, ScheduleSchema };