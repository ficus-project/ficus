import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetResourcesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    from: schema.date.optional({}, [rules.beforeOrEqual('today')]),
    to: schema.date.optional({}, [rules.afterField('from')]),
  })
}
