import { expect, test } from 'claude-code/testing'

const BAND = { component: 'AbovePrompt', props: { hasSurvey: false } } as const

test('band counts changed files and final/ ones, then hides', async ($, on) => {
  on('tool.call', ($, e, next) => ({ result: {}, text: 'ok', isError: false }) as never)
  on('ui.render', ($, e) => { const { Text } = $.ui.resolve(e); return <Text>base</Text> })
  const ui = await $.ui.mount({ plugin: 'what-changed', surface: 'terminal', ...BAND })

  await $.tool.call({ tool: 'Edit', file_path: '/b/final/ch1.md', old_string: 'a', new_string: 'b' })
  await $.tool.call({ tool: 'Write', file_path: '/b/draft/ch2.md', content: 'x' })

  expect((await ui.find({ type: 'Text', text: /2 files, 1 in final\// })) !== undefined).toBe(true)
  await ui.press({ key: 'hide' })
  expect(await ui.find({ type: 'Text', text: /Changed/ })).toBeUndefined()
})
