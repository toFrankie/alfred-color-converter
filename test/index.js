import test from 'ava'
import alfyTest from 'alfy-test'

test('main', async t => {
  const alfy = alfyTest()

  const result = await alfy('#fff')
  console.log('-->', result)

  t.deepEqual(result, [
    {
      title: 'rgb(255, 255, 255)',
      subtitle: `convert '#fff' to 'rgb(255, 255, 255)'`,
      arg: 'rgb(255, 255, 255)',
    },
  ])
})
