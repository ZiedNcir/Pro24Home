import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {AppRegistry, ScrollView, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ThemeProvider} from '../../../../src/theme';
import i18n from '../../../../src/utils/i18n';
import DocumentsView from '../../../../src/roles/professional/documents/ui/ProfessionalDocumentsView';
i18n.changeLanguage('fr');
const docs = ['identity_front','identity_back'].map((name,id)=>({id,name,type:'img',url:'',uploaded_at:'',status:'pending'}));
function Preview(){React.useEffect(()=>{SplashScreen.hide();},[]);const [type,setType]=React.useState('proof_of_address');return <SafeAreaProvider><ThemeProvider><SafeAreaView style={{flex:1,backgroundColor:'white',alignItems:'center'}}><ScrollView style={{width:390,flex:1}}><DocumentsView documents={docs} activeType={type} isUploading={false} isFetching={false} profileError={false} onChooseFile={()=>{}} onTakePhoto={()=>{}} onSelectType={setType} onContinue={()=>{}} onRefresh={()=>{}} onBack={()=>{}} onHelp={()=>{}} /></ScrollView></SafeAreaView></ThemeProvider></SafeAreaProvider>}
AppRegistry.registerComponent('Pro24Home',()=>Preview);
