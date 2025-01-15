import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'countries' })
export class Country extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  latitude: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  longitude: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  createdBy: number;
}
