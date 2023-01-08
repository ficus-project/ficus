import { rules, schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EAggregateFunctions } from 'ficus-models/lib/consumption';

export default class GetConsumptionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    from: schema.date(),
    to: schema.date(),
    window: schema.string.optional({}, [rules.regex(/^\d+[hdw]$/)]),
    aggregate: schema.enum.optional(Object.values(EAggregateFunctions)),
  })

  public messages: CustomMessages = {
    'window.regex': 'The window must represent a duration with a number and h/d/w (ex: 1d, 4h)'
  }
}
