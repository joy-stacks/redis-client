/*
 * @Author: JOY
 * @Date: 2024-06-06 16:11:39
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 13:56:03
 * @Description: 管道
 */
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { ResponseStatus } from "../../utils";
import { CustomHttpException } from "../filters/exception.filter";

@Injectable()
export class ValidatePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      // 错误信息解析
      const errs = errors.map((err) => {
        const constraints = err.constraints || {};
        const first = Object.keys(constraints)[0];
        return {
          field: err.property,
          error: constraints[first],
        };
      });
      const desc = (errs[0] && errs[0].error) || "";
      throw new CustomHttpException(ResponseStatus.ParamInValid, desc);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
