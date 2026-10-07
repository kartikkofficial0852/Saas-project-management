#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0aaa252cadc74192cfc041d88a227a5d94ea2bc34515397ad7a7b19d1ed6a7fd/contract';
import startContract from '../../snapshots/0aaa252cadc74192cfc041d88a227a5d94ea2bc34515397ad7a7b19d1ed6a7fd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/15daa80d9e5e7b94bb972ffb1091d7ac48c282d1a7031646e8a6f4ae18481552/contract';
import endContract from '../../snapshots/15daa80d9e5e7b94bb972ffb1091d7ac48c282d1a7031646e8a6f4ae18481552/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
