export class BiletDTO {
  idBilet: number;
  codQR: string;
  comandaId: number;
  evenimentId: number;
  tipBiletId: number;
}

export class CreateBiletDTO {
  codQR: string;
  comandaId: number;
  evenimentId: number;
  tipBiletId: number;
}
