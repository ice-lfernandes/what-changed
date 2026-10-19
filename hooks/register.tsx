import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { ChangedFiles } from '../types'

const files = atom({ plugin: 'what-changed', key: 'files' } as const, [] as ChangedFiles)
const isHidden = atom({ plugin: 'what-changed', key: 'isHidden' } as const, false)

const isFinal = (path: string) => path.split('/').includes('final')

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    await update($, files, () => [])
    await update($, isHidden, () => false)

    return next(e)
  })

  for (const tool of ['Edit', 'Write'] as const) {
    on('tool.call', { tool }, async ($, e, next) => {
      const ran = await next(e)

      if (ran.deny === undefined && ran.isError !== true) {
        await update($, files, list => (list.includes(e.file_path) ? list : [...list, e.file_path]))

        if (isFinal(e.file_path)) {
          $.ui.toast(`final/ changed: ${e.file_path.split('/').pop()}`)
        }
      }

      return ran
    })
  }

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = await read($, files)

    if (list.length === 0 || (await read($, isHidden))) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>
          Changed this turn: {list.length} files, {list.filter(isFinal).length} in final/{' '}
        </Text>
        <Button key="hide" label="Hide" onPress={() => update($, isHidden, () => true)} />
      </Box>
    )
  })
}
