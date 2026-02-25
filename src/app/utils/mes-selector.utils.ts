export type Mes =
  | 'JAN/26'
  | 'FEV/26'
  | 'MAR/26'
  | 'ABR/26'
  | 'MAI/26'
  | 'JUN/26'
  | 'JUL/26'
  | 'AGO/26'
  | 'SET/26'
  | 'OUT/26'
  | 'NOV/26'
  | 'DEZ/26';

export interface MesOption {
  label: string;
  value: Mes;
  disabled: boolean;
}

const MESES_BASE: ReadonlyArray<MesOption> = [
  { label: 'JAN/26', value: 'JAN/26', disabled: false },
  { label: 'FEV/26', value: 'FEV/26', disabled: false },
  { label: 'MAR/26', value: 'MAR/26', disabled: false },
  { label: 'ABR/26', value: 'ABR/26', disabled: false },
  { label: 'MAI/26', value: 'MAI/26', disabled: false },
  { label: 'JUN/26', value: 'JUN/26', disabled: false },
  { label: 'JUL/26', value: 'JUL/26', disabled: false },
  { label: 'AGO/26', value: 'AGO/26', disabled: false },
  { label: 'SET/26', value: 'SET/26', disabled: false },
  { label: 'OUT/26', value: 'OUT/26', disabled: true },
  { label: 'NOV/26', value: 'NOV/26', disabled: true },
  { label: 'DEZ/26', value: 'DEZ/26', disabled: true }
];

const MESES_SIGLA: ReadonlyArray<string> = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const MESES_MAP: Readonly<Record<string, string>> = {
  JAN: '01',
  FEV: '02',
  MAR: '03',
  ABR: '04',
  MAI: '05',
  JUN: '06',
  JUL: '07',
  AGO: '08',
  SET: '09',
  OUT: '10',
  NOV: '11',
  DEZ: '12'
};

export function criarMeses(): MesOption[] {
  return MESES_BASE.map((mes) => ({ ...mes }));
}

export function obterMesAtualDisponivel(meses: ReadonlyArray<MesOption>, fallback: Mes = 'FEV/26'): Mes {
  const data = new Date();
  const ano = String(data.getFullYear()).slice(-2);
  const nomeMes = MESES_SIGLA[data.getMonth()];
  const mesAtual = `${nomeMes}/${ano}` as Mes;

  const mesExiste = meses.find((mes) => mes.value === mesAtual);
  if (mesExiste && !mesExiste.disabled) {
    return mesAtual;
  }

  const mesHabilitado = [...meses].reverse().find((mes) => !mes.disabled);
  return mesHabilitado?.value || fallback;
}

export function selecionarMesDisponivel(mes: Mes, meses: ReadonlyArray<MesOption>, atual: Mes): Mes {
  const mesExiste = meses.find((item) => item.value === mes);
  if (!mesExiste || mesExiste.disabled) {
    return atual;
  }

  return mesExiste.value;
}

export function formatarMesParaDataAPI(mes: Mes): string {
  const [nomeMes, ano] = mes.split('/');
  const mesNumero = MESES_MAP[nomeMes];
  return `20${ano}-${mesNumero}-01`;
}
