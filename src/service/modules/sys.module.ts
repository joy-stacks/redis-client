import { Logger, Module } from "@nestjs/common";

import { SysController } from "../controller/sys.controller";
import { SysService } from "../services/sys.service";

@Module({
  controllers: [SysController],
  providers: [SysService, Logger],
})
export class SysModule {}
