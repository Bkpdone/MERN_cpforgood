const mongoose=require('mongoose');
mongoose.set('strictQuery',false);
 
//const uri ="mongodb://0.0.0.0:27017/cpforgood"
const uri ="mongodb+srv://Bhaveshpharate:Honar@cluster0.8blrruf.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri);
const db=mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(err, res){
  console.log("Hi Bhavesh Sir MongoDb DataBase is Connected SuceessFully.............");
});

module.exports=db;