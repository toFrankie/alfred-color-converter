import test from 'ava'
import alfyTest from 'alfy-test'

test('main', async t => {
  const alfy = alfyTest()

  const result = await alfy('#fff')

  t.deepEqual(result, [
    {
      title: 'rgb(255, 255, 255)',
      subtitle: 'Press enter copy to clipboard.',
      arg: 'rgb(255, 255, 255)',
    },
  ])
})
