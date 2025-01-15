import { dirPath } from '@/utils/dir'
import { logger, requireFileSync } from 'node-karin'

const pkg = requireFileSync(`${dirPath}/package.json`)

/** 请不要在这编写插件 不会有任何效果~ */
logger.info(`${logger.violet(`[插件:${pkg.version}]`)} ${logger.green(pkg.name)} 初始化完成~`)
