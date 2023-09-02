import { Client, ActivityType } from 'discord.js'
import { google } from 'googleapis'
import path from 'path'

export default async function(client: Client<true>):Promise<void> {
    client.user.setActivity("正在唱歌", { type: ActivityType.Custom})

    const interval = 15;
    const min = 60000

    const channel = client.channels.cache.get("642232690644353037")
    // const channel = await client.channels.fetch("642232690644353037")
    setInterval(async ()=>{
        try{
            const googleClient = await getClient("server-secret.json")
            const dateBefore = new Date(Date.now().valueOf() - interval * min) //10 min
            const queryList = await searchVideoId(googleClient, "ai 統神", dateBefore)
            queryList?.forEach( url => {
                //@ts-ignore
                channel?.send(url)
            })
            console.log(queryList)
        }catch(error){
            console.log(error)
        }
        
    }, interval * min)
}

function getClient(keyFile: string){
    const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: "https://www.googleapis.com/auth/youtube"
    })
    return auth.getClient()
}

async function searchVideoId(auth: any, q: string, dateBefore: Date){
    const youtube = google.youtube({version:"v3", auth})
    const result = await youtube.search.list({
        part: ["id", "snippet"],
        q,
        // maxResults: size,
        publishedAfter: dateBefore.toISOString()
    })
    const videoIds = result.data.items?.map(item=>item.id?.videoId)
    return videoIds?.map(id=>`https://www.youtube.com/watch?v=${id}`)
}