import { parse } from 'date-fns';
import { readdirSync } from 'fs';
import { chunk } from 'lodash';
import { join } from 'path';
import { EntityManager } from 'typeorm';

import loadCsvAndExec from '../helpers/loadCsvAndExec';
import { City } from '../models/city';
import { Diagnostic } from '../models/diagnostic';
import { Gender } from '../models/enums/gender.enum';
import { EducationalLevel } from '../models/enums/educational-level.enum';
import { Ethnic } from '../models/enums/ethnic.enum';
import { Hospitalization } from '../models/hospitalization';
import { Pacient } from '../models/pacient';
import { Procedure } from '../models/procedure';

interface Dimensions {
  cities: City[];
  cids: Diagnostic[];
  procedures: Procedure[];
}

interface RawHospitalization {
  IDADE: string;
  MORTE: string;
  NACIONAL: string;
  INSTRU: string;
  CBOR: string;
  CNES: string;
  RACA_COR: string;
  VAL_TOT: string;
  PROC_REA: string;
  DIAR_ACOM: string;
  QT_DIARIAS: string;
  N_AIH: string;
  SEXO: string;
  NASC: string;
  DT_INTER: string;
  NUM_FILHOS: string;
  DIAG_PRINC: string;
  MUNIC_RES: string;
  CGC_HOSP: string;
}

export default async function loadSus(
  manager: EntityManager,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dimensions: Dimensions,
) {
  const path = join(__dirname, '..', '..', 'datasets', 'sus');

  const repo = manager.getRepository(Hospitalization);
  const pacientRepo = manager.getRepository(Pacient);

  const hospitalizationsMatrix = await Promise.all(
    readdirSync(path).map(async (file) => {
      const fullPath = join(path, file);
      console.log('Loading file %s', fullPath);

      return loadCsvAndExec<RawHospitalization, Hospitalization>({
        path: fullPath,
        exec: async (value) => {
          let gender = Gender.male;
          if (value.SEXO === '0') {
            gender = Gender.unknown;
          } else if (value.SEXO !== '1') {
            gender = Gender.female;
          }

          return repo.create({
            code: value.N_AIH,
            amount: Math.trunc(parseFloat(value.VAL_TOT) * 100),
            date: parse(value.DT_INTER, 'yyyymmdd', 0),
            dailyInternated: parseInt(value.QT_DIARIAS),
            dailyWithCompanion: parseInt(value.DIAR_ACOM),
            procedureId: value.PROC_REA,
            diagnosticId: value.DIAG_PRINC,
            pacientCityId: value.MUNIC_RES,
            healthOrganizationId: value.CNES,
            pacient: pacientRepo.create({
              age: parseInt(value.IDADE),
              childCount: parseInt(value.NUM_FILHOS),
              educationLevel: parseEducationalLevel(value.INSTRU),
              ethnic: parseEthnic(value.RACA_COR),
              gender: gender,
              isDead: value.MORTE === '1' ? true : false,
              role: value.CBOR,
            }),
          });
        },
      });
    }),
  );

  const hospitalizations = hospitalizationsMatrix.flat();
  for (const hops of chunk(hospitalizations, 1000)) {
    const result = await manager.transaction(async (tx) => tx.save(hops));
    console.log('Saved %d hospitalizations', result.length);
  }

  console.log('Loaded %d hospitalizations', hospitalizations.length);

  return hospitalizations;
}

function parseEducationalLevel(INSTRU: string): EducationalLevel {
  switch (INSTRU) {
    case '01':
      return EducationalLevel.illiterate;
    case '02':
      return EducationalLevel.elementary;
    case '03':
      return EducationalLevel.highSchool;
    case '04':
      return EducationalLevel.college;
    default:
      return EducationalLevel.unknown;
  }
}

function parseEthnic(RACA_COR: string): Ethnic {
  switch (RACA_COR) {
    case '01':
      return Ethnic.white;
    case '02':
      return Ethnic.black;
    case '03':
      return Ethnic.latin;
    case '04':
      return Ethnic.asian;
    case '05':
      return Ethnic.native;
    default:
      return Ethnic.unknown;
  }
}
