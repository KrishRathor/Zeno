import { NodeNotification } from "./lib/node/node";

const appId = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktyaXNoIiwiZW1haWwiOiJrcmlzaHJhdGhvcjE4QGdtYWlsLmNvbSIsImlhdCI6MTcxNzg2NjM1N30.WbuV90gvLBa1FWrs0LmCjtYilQTmgVQ17qOHCjr2lW8'

const node = new NodeNotification({
  appId
});

async function main() {

  console.log('came here');

  const trigger = node.InApp.trigger({
    subscriberId: 'user1',
    message: 'Fully featured notification center in minutes',
    read: false
  })

  const trigger3 = node.InApp.trigger({
    subscriberId: 'user1',
    message: 'Fully featured notification center in minutes',
    read: false
  })

  const trigger2 = node.InApp.trigger({
    subscriberId: 'user1',
    message: 'Fully featured notification center in minutes',
    read: true
  })

  const trigger4 = node.InApp.trigger({
    subscriberId: 'user1',
    message: 'Fully featured notification center in minutes',
    read: true
  })

}

main();
