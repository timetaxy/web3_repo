const HDFS_FOLDERS = {
    raw_trans: ['vote', 'success_parsing', 'fail_parsing'],
    tokens: ['raw_tokens', 'raw_holders']
}

const a = Object.entries(HDFS_FOLDERS)
for (let i = 0; i < a.length; i++) {
    const regex = new RegExp(`^${a[i][1].join('|')}.*$`)
    console.log(regex)
    if (regex.test('raw_tokens.202212323.log')) {
        console.log(11111)
    }
    // if (a[i][1].includes('vote')) {
    //     console.log(a[i][0])
    // } else {
    //     console.log(a[i][0])
    // }
}

// const a = 'stop.2022'
// b = 'stop'
// const regex = new RegExp(`^${b}.*$`)
// console.log(regex.test(a))
// console.log((/^stop.*$/).test(a))