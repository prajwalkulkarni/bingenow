function getMessage(responsedata:any):[string,"success"|"error"|"info"|"warning"]{
       if(responsedata){
         
        if(Object.keys(responsedata).includes('errors')){
            return [responsedata.errors[0].message,"info"]
        }
        else{
            return [responsedata?.data.addToWatchlist.title + ' added to watchlist',"success"]
        }
       }
       return ["","info"]

}

export default getMessage;