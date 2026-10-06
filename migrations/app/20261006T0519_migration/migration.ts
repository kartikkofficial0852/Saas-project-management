#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0aaa252cadc74192cfc041d88a227a5d94ea2bc34515397ad7a7b19d1ed6a7fd/contract';
import endContract from '../../snapshots/0aaa252cadc74192cfc041d88a227a5d94ea2bc34515397ad7a7b19d1ed6a7fd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
