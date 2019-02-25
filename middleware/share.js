import Share from '../utils/share'

export default function(context) {

    if(process.server){
        return;
    }

    Share({link: location.origin+ context.route.fullPath})
}