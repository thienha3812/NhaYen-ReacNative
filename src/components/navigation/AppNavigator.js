import { createStackNavigator} from 'react-navigation-stack';
import Login from '../login/login';
import Home from '../home/home';
import AddTime from '../time/add';
import EditTime from '../time/edit';
import Chart from '../chart/chart';
import Camera  from '../camera/camera'
const AppStack = createStackNavigator (
    {
        Login : Login,
        Home : Home,
        AddTime : AddTime,
        EditTime : EditTime,
        Chart : Chart,
        Camera : Camera
    },
    {
        initialRouteName: 'Login',
        defaultNavigationOptions :{ 
//         header : null
        }
    }
)
export default AppStack;
