import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators, FormControl,AbstractControl } from '@angular/forms';
import { ApiurlsService } from '../../../../services/api-urls/apiurls.service';
import { UtilityService } from '../../../../services/utilities/utilities.services';
import { StorageService } from '../../../../services/localstorage/storage.service';
import { ApirequestService } from '../../../../services/apirequest/apirequest.service';
import { fsKey } from '../../../../config/hybse.config';


declare var filestack:any;

@Component({
  selector: 'hybse-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(private _utils: UtilityService, private _fb:FormBuilder,private _req: ApirequestService, private _lstore: StorageService,private _urls:ApiurlsService,private router:Router ) { }

  userUpdatePage:boolean = false;
  userUpdateDocument:boolean = false;
  

  userUpdateProfile(){
    if(this.userTypedisplay == 'Investor'){
           this.userUpdatePage = true;
           this.userUpdateDocument = false;
           this.scrollToTop();
    } else{
      // window.open("https://new.apollo.business-software.in/backend", "_blank");     // Dev Server
      //window.open("https://new.hybsedev.ddns.net/backend", "_blank");       // Staging Server
    }      
  }
  userUpdateDocuments(){
    if(this.userTypedisplay == 'Investor'){
      this.userUpdatePage = true;
      this.userUpdateDocument = true;
      this.scrollToTop();
    } else {
     // window.open("https://new.apollo.business-software.in/backend", "_blank");      //Dev Server
      window.open("https://new.hybsedev.ddns.net/backend", "_blank");       // Staging Server
    }
  }
 
  updateUserDetailForm:FormGroup;
  updateUserFinancialForm:FormGroup;
  profilePic:boolean = true;
  isNoPic:boolean = true;

  updateUserDetailInit(){
    this.updateUserDetailForm = this._fb.group({
      'firstName': ['',[Validators.required]],
      'lastName': ['',[Validators.required]],
      // 'userName': ['',[Validators.required]],
      'gender': [''],
      'dobDate': this._fb.group({
        'dobYear': ['', [Validators.required]],
        'dobMonth': ['', [Validators.required]],
        'dobDay': ['', [Validators.required]]
    }),
       'country': ['',[Validators.required]],
      'address1': ['',[Validators.required]],
      'address2': ['',[Validators.required]],
      'zipCode': ['',[Validators.required]],
      'city':['',[Validators.required]],
      // 'email': ['',[Validators.required,this.validateEmail]],
      'countryCode': ['',[Validators.required]],
      'phone': ['',[Validators.required,this.validateNumber]],
      
    
    },
          { updateOn: 'blur' });
  }

 
  updateUserFinancialInit(){
    this.updateUserFinancialForm = this._fb.group({
      'nemAddress': ['',[Validators.required]]
    },
    { updateOn: 'blur' });
}  
  

  validateEmail(input:FormControl) {
    let val = input.value;
    let regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!regex.test(val) && val != '' )  {
        return {
            emailInvalid: true
        }
    }
    return null;
}

  validateNumber(input:FormControl) {
      let val = input.value;
    let regex =/^\d+$/;
      if (!regex.test(val) && val != '' )  {
          return {
              numberInvalid: true
          }
      }
  
      return null;
  }
  

  
  updateUserDetailFormValidate:boolean=false;
  responseSuccess:boolean = false;
  disableButton:boolean = false;
  showLoader:boolean = false;
  idUser:any;
  Mesg:string = '';

  updateUserFinancialFormValidate:boolean=false;
  updateUserFinancialresponseSuccess:boolean = false;
  updateUserFinancialdisableButton:boolean = false;
  updateUserFinancialshowLoader:boolean = false;
  updateUserFinancialMesg:string = '';

  updateUserDetailSubmit(){
    
        this.updateUserDetailFormValidate=true;
        this.showLoader = true;
        this.disableButton = true;


    // alert("working");
    let formVal = this.updateUserDetailForm.value;
    

        this.idUser = this._lstore.getLocalItems('user');
        let data = {
          idUser: this.idUser,
          gender: formVal.gender,
          firstName: formVal.firstName,
          lastName: formVal.lastName,
          dobDate: formVal.dobYear + formVal.dobMonth + formVal.dobDay,
          country: formVal.country,
          address1: formVal.address1,
          address2: formVal.address2,
          zipCode: formVal.zipCode,
          city:formVal.city,
          countryCode: formVal.countryCode,
          phone: formVal.phone
          // nemAddress: formVal.nemAddress,
                 };

                 this._req.fetchApiData(this._urls.updateUserDetailsUrl,data).subscribe(
                  (data:any) => {
                    //  console.log('update',data);
                     this.showLoader = false;
                     
                     this.responseSuccess = true;
                     this.disableButton = false;
                     let response = data;

                     if(response.data == '') {
                      this.showLoader = false;

                      if( response.error != '' ){
                        this.showLoader = false;
                        this.disableButton = false;
                        this.Mesg=response.error['Error Description'];
                        // console.log(this.Mesg);
                        this.responseSuccess = false;

                      }
                      
                      }
                      else{
                      this.showLoader = false;
                      this.disableButton = false;
                      this.Mesg = "Details Updated Successfully";
                      // console.log(this.Mesg);
                      this.responseSuccess = true;
                      }

                      setTimeout(()=>{
                        this.userDetails();
                        this.userUpdatePage = false;
                        this.updateUserDetailForm.reset();
                        this.Mesg ="";
                      },1500);



                 
                  },
                  error => {
            
                  },
                  () => {
            
                  }) 
      
    }


    updateFinancialDetailFormSubmit(){
    
      this.updateUserFinancialFormValidate=true;
      this.updateUserFinancialshowLoader = true;
      this.updateUserFinancialdisableButton = true;

       let formVal = this.updateUserFinancialForm.value;
  

      this.idUser = this._lstore.getLocalItems('user');
      let data = {
        idUser: this.idUser,
        nemAddress: formVal.nemAddress,
               };

               this._req.fetchApiData(this._urls.updateUserFinancialUrl,data).subscribe(
                (data:any) => {
                  //  console.log('update',data);

                   this.updateUserFinancialshowLoader = false;
                   this.updateUserFinancialresponseSuccess = true;
                   this.updateUserFinancialdisableButton = false;
                   let response = data;

                   if(response.data == '') {
                    this.updateUserFinancialshowLoader = false;

                    if( response.error != '' ){
                      this.updateUserFinancialshowLoader = false;
                      this.updateUserFinancialdisableButton = false;
                      this.updateUserFinancialMesg=response.error['Error Description'];
                      // console.log(this.updateUserFinancialMesg);
                      this.updateUserFinancialresponseSuccess = false;

                    }
                    
                    }
                    else{
                    this.updateUserFinancialshowLoader = false;
                    this.updateUserFinancialdisableButton = false;
                    this.updateUserFinancialMesg = "Details Updated Successfully";
                    // console.log(this.updateUserFinancialMesg);
                    this.updateUserFinancialresponseSuccess = true;
                    }

                    setTimeout(()=>{
                      this.userDetails();
                      this.userUpdatePage = false;
                      this.updateUserFinancialMesg ="";

                    },1500);



               
                },
                error => {
          
                },
                () => {
          
                }) 
    
  }



  



  cancelUserDetail(){
    this.userUpdatePage = false;

  }
  responsefirstName:any;
  responselastName:any;
  responseuserName:any;
  responseEmail:any;
  responseDob:any;
  responseGender:any;
  responseaddress1:any;
  responseaddress2:any;
  responsecountry:any;
  responsecity:any;
  responsetelcode:any;
  responsemobile:any;
  responsenemAddress:any;
  responseTempAvatar:any;
  responseAvatar:any;
  localeName:any;

  responseLanguage:any;
  responseChartType:any;


  userDetails(){
    this.idUser = this._lstore.getLocalItems('user');

    let data = {          idUser: this.idUser
    };
    this._req.fetchApiData(this._urls.userDetailsUrl,data).subscribe(
      (data:any) => {
        //  console.log('update',data);
         let response = data.data;
         this.setProfileVal(response);
         this.responsefirstName = response.firstName;
         this.responselastName = response.lastName;
         this.responseuserName = response.userName;
         this.responseEmail = response.emailId;
         this.responseGender = response.gender;
         this.responseDob = response.dob;
         this.responseaddress1 = response.address1;
         this.responseaddress2 = response.address2;
         this.responsecountry = response.country;
         this.responsecity = response.city;
         this.responsetelcode = response.telcode;
         this.responsemobile = response.mobile;
         this.responsenemAddress = response.nemAddress;
         this.responseTempAvatar = response.avatar;
         this.responseLanguage = response.localeName;
         this.responseChartType = response.preferredChart;
         if(this.responseTempAvatar == 'N/A'){
                     this.isNoPic = true;      
         }
         else{
          this.isNoPic = false; 
          this.responseAvatar = this.responseTempAvatar;
         }
         this.showLoader = false;
         this.profilePic = true;
      },
      error => {

      },
      () => {

      })
  }

  setProfileVal(res) {
      let dob:any = res.dob == 'N/A' ? '' :new Date(res.dob);
    
      // console.log(dob.getDate());


      this.updateUserDetailForm.patchValue({
        
        firstName: res.firstName == 'N/A' ? '' : res.firstName,
        lastName:  res.lastName == 'N/A' ? '' : res.lastName,
        gender: res.gender == 'N/A' ? '' : res.gender,
        address1: res.address1 == 'N/A' ? '' : res.address1 ,
        address2: res.address2 == 'N/A' ? '' : res.address2,
        country: res.country == 'N/A' ? '' : res.country,
        city: res.city == 'N/A' ? '' : res.city,
        zipCode:res.zipCode == 'N/A' ? '' : res.zipCode,
        countryCode:res.telcode == 'N/A' ? '' : res.telcode,
        phone:res.mobile == 'N/A' ? '' :res.mobile ,
        dobDate: {
          dobYear:dob == '' ? dob : dob.getFullYear() ,
        dobMonth:dob == '' ? dob :dob.getMonth() ,
        dobDay:dob == '' ? dob : dob.getDate() ,
        }
        });
        this.updateUserFinancialForm.patchValue({
            nemAddress:res.nemAddress
        });


  }

  scrollToTop() {
    this._utils.scrollToY(0,400,'easeInOutQuint');
  }

  month=[
    {val:'1',name:'January'},
    {val:'2',name:'Febraury'},
    {val:'3',name:'March'},
    {val:'4',name:'April'},
    {val:'5',name:'May'},
    {val:'6',name:'June'},
    {val:'7',name:'July'},
    {val:'8',name:'Augest'},
    {val:'9',name:'September'},
    {val:'10',name:'October'},
    {val:'11',name:'November'},
    {val:'12',name:'December'}
];

day=[
    {val:'1',name:'1'},
    {val:'2',name:'2'},
    {val:'3',name:'3'},
    {val:'4',name:'4'},
    {val:'5',name:'5'},
    {val:'6',name:'6'},
    {val:'7',name:'7'},
    {val:'8',name:'8'},
    {val:'9',name:'9'},
    {val:'10',name:'10'},
    {val:'11',name:'11'},
    {val:'12',name:'12'},
    {val:'13',name:'13'},
    {val:'14',name:'14'},
    {val:'15',name:'15'},
    {val:'16',name:'16'},
    {val:'17',name:'17'},
    {val:'18',name:'18'},
    {val:'19',name:'19'},
    {val:'20',name:'20'},
    {val:'21',name:'21'},
    {val:'22',name:'22'},
    {val:'23',name:'23'},
    {val:'24',name:'24'},
    {val:'25',name:'25'},
    {val:'26',name:'26'},
    {val:'27',name:'27'},
    {val:'28',name:'28'},
    {val:'29',name:'29'},
    {val:'30',name:'30'},
    {val:'31',name:'31'}
];


year=[
{val:'1950',name:'1950'},
{val:'1951',name:'1951'},
{val:'1952',name:'1952'},
{val:'1953',name:'1953'},
{val:'1954',name:'1954'},
{val:'1955',name:'1955'},
{val:'1956',name:'1956'},
{val:'1957',name:'1957'},
{val:'1958',name:'1958'},
{val:'1959',name:'1959'},
{val:'1960',name:'1960'},
{val:'1961',name:'1961'},
{val:'1962',name:'1962'},
{val:'1963',name:'1963'},
{val:'1964',name:'1964'},
{val:'1965',name:'1965'},
{val:'1966',name:'1966'},
{val:'1967',name:'1967'},
{val:'1968',name:'1968'},
{val:'1969',name:'1969'},
{val:'1970',name:'1970'},
{val:'1971',name:'1971'},
{val:'1972',name:'1972'},
{val:'1973',name:'1973'},
{val:'1974',name:'1974'},
{val:'1975',name:'1975'},
{val:'1976',name:'1976'},
{val:'1977',name:'1977'},
{val:'1978',name:'1978'},
{val:'1979',name:'1979'},
{val:'1980',name:'1980'},
{val:'1981',name:'1981'},
{val:'1982',name:'1982'},
{val:'1983',name:'1983'},
{val:'1984',name:'1984'},
{val:'1985',name:'1985'},
{val:'1986',name:'1986'},
{val:'1987',name:'1987'},
{val:'1988',name:'1988'},
{val:'1989',name:'1989'},
{val:'1990',name:'1990'},
{val:'1991',name:'1991'},
{val:'1992',name:'1992'},
{val:'1993',name:'1993'},
{val:'1994',name:'1994'},
{val:'1995',name:'1995'},
{val:'1996',name:'1996'},
{val:'1997',name:'1997'},
{val:'1998',name:'1998'},
{val:'1999',name:'1999'},
{val:'2000',name:'2000'},
{val:'2001',name:'2001'},
{val:'2002',name:'2002'},
{val:'2003',name:'2003'},
{val:'2004',name:'2004'},
{val:'2005',name:'2005'},
{val:'2006',name:'2006'},
{val:'2007',name:'2007'},
{val:'2008',name:'2008'},
{val:'2009',name:'2009'},
{val:'2010',name:'2010'},
{val:'2011',name:'2011'},
{val:'2012',name:'2012'},
{val:'2013',name:'2013'},
{val:'2014',name:'2014'},
{val:'2015',name:'2015'},
{val:'2016',name:'2016'},
{val:'2017',name:'2017'},
{val:'2018',name:'2018'},
]

isoCountries = [
  {code:'AFG' , name: 'Afghanistan'},
  {code:'AXI' , name: 'Aland Islands'},
  {code:'ALB' , name: 'Albania'},
  {code:'DZA' , name: 'Algeria'},
  {code:'ASM' , name: 'American Samoa'},
  {code:'AND' , name: 'Andorra'},
  {code:'AGO' , name: 'Angola'},
  {code:'AIA' , name: 'Anguilla'},
  {code:'ATA' , name: 'Antarctica'},
  {code:'ATG' , name: 'Antigua And Barbuda'},
  {code:'ARG' , name: 'Argentina'},
  {code:'ARM' , name: 'Armenia'},
  {code:'ABW' , name: 'Aruba'},
  {code:'AUS' , name: 'Australia'},
  {code:'AUT' , name: 'Austria'},
  {code:'AZE' , name: 'Azerbaijan'},
  {code:'BHS' , name: 'Bahamas'},
  {code:'BHR' , name: 'Bahrain'},
  {code:'BGD' , name: 'Bangladesh'},
  {code:'BRB' , name: 'Barbados'},
  {code:'BLR' , name: 'Belarus'},
  {code:'BEL' , name: 'Belgium'},
  {code:'BLZ' , name: 'Belize'},
  {code:'BEN' , name: 'Benin'},
  {code:'BMU' , name: 'Bermuda'},
  {code:'BTN' , name: 'Bhutan'},
  {code:'BOL' , name: 'Bolivia'},
  {code:'BIH' , name: 'Bosnia And Herzegovina'},
  {code:'BWA' , name: 'Botswana'},
  {code:'BVT' , name: 'Bouvet Island'},
  {code:'BRA' , name: 'Brazil'},
  {code:'IOT' , name: 'British Indian Ocean Territory'},
  {code:'BRN' , name: 'Brunei Darussalam'},
  {code:'BGR' , name: 'Bulgaria'},
  {code:'BFA' , name: 'Burkina Faso'},
  {code:'BDI' , name: 'Burundi'},
  {code:'KHM' , name: 'Cambodia'},
  {code:'CMR' , name: 'Cameroon'},
  {code:'CAN' , name: 'Canada'},
  {code:'CPV' , name: 'Cape Verde'},
  {code:'CYM' , name: 'Cayman Islands'},
  {code:'CAF' , name: 'Central African Republic'},
  {code:'TCD' , name: 'Chad'},
  {code:'CHL' , name: 'Chile'},
  {code:'CHN' , name: 'China'},
  {code:'CXR' , name: 'Christmas Island'},
  {code:'CCK' , name: 'Cocos (Keeling) Islands'},
  {code:'COL' , name: 'Colombia'},
  {code:'COM' , name: 'Comoros'},
  {code:'COG' , name: 'Congo'},
  {code:'COD' , name: 'Congo, Democratic Republic'},
  {code:'COK' , name: 'Cook Islands'},
  {code:'CRI' , name: 'Costa Rica'},
  {code:'CIV' , name: 'Cote D\'Ivoire'},
  {code:'HRV' , name: 'Croatia'},
  {code:'CUB' , name: 'Cuba'},
  {code:'CYP' , name: 'Cyprus'},
  {code:'CZE' , name: 'Czech Republic'},
  {code:'DNK' , name: 'Denmark'},
  {code:'DJI' , name: 'Djibouti'},
  {code:'BMA' , name: 'Dominica'},
  {code:'DOM' , name: 'Dominican Republic'},
  {code:'ECU' , name: 'Ecuador'},
  {code:'EGY' , name: 'Egypt'},
  {code:'SLV' , name: 'El Salvador'},
  {code:'GNQ' , name: 'Equatorial Guinea'},
  {code:'ERI' , name: 'Eritrea'},
  {code:'EST' , name: 'Estonia'},
  {code:'ETH' , name: 'Ethiopia'},
  {code:'FLK' , name: 'Falkland Islands (Malvinas)'},
  {code:'FRO' , name: 'Faroe Islands'},
  {code:'FJI' , name: 'Fiji'},
  {code:'FIN' , name: 'Finland'},
  {code:'FRA' , name: 'France'},
  {code:'GUF' , name: 'French Guiana'},
  {code:'PYF' , name: 'French Polynesia'},
  {code:'ATF' , name: 'French Southern Territories'},
  {code:'GAB' , name: 'Gabon'},
  {code:'GMB' , name: 'Gambia'},
  {code:'GEO' , name: 'Georgia'},
  {code:'DEU' , name: 'Germany'},
  {code:'GHA' , name: 'Ghana'},
  {code:'GIB' , name: 'Gibraltar'},
  {code:'GRC' , name: 'Greece'},
  {code:'GRL' , name: 'Greenland'},
  {code:'GRD' , name: 'Grenada'},
  {code:'GLP' , name: 'Guadeloupe'},
  {code:'GUM' , name: 'Guam'},
  {code:'GTM' , name: 'Guatemala'},
  {code:'GGY' , name: 'Guernsey'},
  {code:'GIN' , name: 'Guinea'},
  {code:'GNB' , name: 'Guinea-Bissau'},
  {code:'GUY' , name: 'Guyana'},
  {code:'HTI' , name: 'Haiti'},
  {code:'HMD' , name: 'Heard Island & Mcdonald Islands'},
  {code:'VAT' , name: 'Holy See (Vatican City State)'},
  {code:'HND' , name: 'Honduras'},
  {code:'HKG' , name: 'Hong Kong'},
  {code:'HUN' , name: 'Hungary'},
  {code:'ISL' , name: 'Iceland'},
  {code:'IND' , name: 'India'},
  {code:'IDN' , name: 'Indonesia'},
  {code:'IRN' , name: 'Iran, Islamic Republic Of'},
  {code:'IRQ' , name: 'Iraq'},
  {code:'IRL' , name: 'Ireland'},
  {code:'IOM' , name: 'Isle Of Man'},
  {code:'ISR' , name: 'Israel'},
  {code:'ITA' , name: 'Italy'},
  {code:'JAM' , name: 'Jamaica'},
  {code:'JPN' , name: 'Japan'},
  {code:'JER' , name: 'Jersey'},
  {code:'JOR' , name: 'Jordan'},
  {code:'KAZ' , name: 'Kazakhstan'},
  {code:'KEN' , name: 'Kenya'},
  {code:'KIR' , name: 'Kiribati'},
  {code:'KOR' , name: 'Korea'},
  {code:'PRK' , name: 'Korea, Republic of'},
  {code:'KWT' , name: 'Kuwait'},
  {code:'KGZ' , name: 'Kyrgyzstan'},
  {code:'LAO' , name: 'Lao People\'s Democratic Republic'},
  {code:'LVA' , name: 'Latvia'},
  {code:'LRN' , name: 'Lebanon'},
  {code:'LSO' , name: 'Lesotho'},
  {code:'LBR' , name: 'Liberia'},
  {code:'LBY' , name: 'Libyan Arab Jamahiriya'},
  {code:'LIE' , name: 'Liechtenstein'},
  {code:'LTT' , name: 'Lithuania'},
  {code:'LUX' , name: 'Luxembourg'},
  {code:'MAC' , name: 'Macao'},
  {code:'MKD' , name: 'Macedonia'},
  {code:'MDG' , name: 'Madagascar'},
  {code:'MWI' , name: 'Malawi'},
  {code:'MYS' , name: 'Malaysia'},
  {code:'MDV' , name: 'Maldives'},
  {code:'MLI' , name: 'Mali'},
  {code:'MLT' , name: 'Malta'},
  {code:'MHL' , name: 'Marshall Islands'},
  {code:'MTQ' , name: 'Martinique'},
  {code:'MRT' , name: 'Mauritania'},
  {code:'MUS' , name: 'Mauritius'},
  {code:'MYT' , name: 'Mayotte'},
  {code:'MEX' , name: 'Mexico'},
  {code:'FSM' , name: 'Micronesia, Federated States Of'},
  {code:'MDA' , name: 'Moldova'},
  {code:'MCO' , name: 'Monaco'},
  {code:'MNG' , name: 'Mongolia'},
  {code:'MEO' , name: 'Montenegro'},
  {code:'MSR' , name: 'Montserrat'},
  {code:'MCR' , name: 'Morocco'},
  {code:'MOZ' , name: 'Mozambique'},
  {code:'MMR' , name: 'Myanmar'},
  {code:'NAM' , name: 'Namibia'},
  {code:'NRU' , name: 'Nauru'},
  {code:'NPL' , name: 'Nepal'},
  {code:'NLD' , name: 'Netherlands'},
  {code:'ANT' , name: 'Netherlands Antilles'},
  {code:'NCL' , name: 'New Caledonia'},
  {code:'NZL' , name: 'New Zealand'},
  {code:'NIC' , name: 'Nicaragua'},
  {code:'NER' , name: 'Niger'},
  {code:'NGA' , name: 'Nigeria'},
  {code:'NIU' , name: 'Niue'},
  {code:'NFK' , name: 'Norfolk Island'},
  {code:'MNP' , name: 'Northern Mariana Islands'},
  {code:'NOR' , name: 'Norway'},
  {code:'OMN' , name: 'Oman'},
  {code:'PAK' , name: 'Pakistan'},
  {code:'PLW' , name: 'Palau'},
  {code:'PSE' , name: 'Palestinian Territory, Occupied'},
  {code:'PAN' , name: 'Panama'},
  {code:'PNG' , name: 'Papua New Guinea'},
  {code:'PRG' , name: 'Paraguay'},
  {code:'PER' , name: 'Peru'},
  {code:'PHL' , name: 'Philippines'},
  {code:'PCN' , name: 'Pitcairn'},
  {code:'POL' , name: 'Poland'},
  {code:'PRT' , name: 'Portugal'},
  {code:'PRO' , name: 'Puerto Rico'},
  {code:'QAT' , name: 'Qatar'},
  {code:'REU' , name: 'Reunion'},
  {code:'ROU' , name: 'Romania'},
  {code:'RUS' , name: 'Russian Federation'},
  {code:'RWA' , name: 'Rwanda'},
  {code:'BLY' , name: 'Saint Barthelemy'},
  {code:'SHN' , name: 'Saint Helena'},
  {code:'KNA' , name: 'Saint Kitts And Nevis'},
  {code:'LCA' , name: 'Saint Lucia'},
  {code:'MFN' , name: 'Saint Martin'},
  {code:'SPM' , name: 'Saint Pierre And Miquelon'},
  {code:'VCT' , name: 'Saint Vincent And Grenadines'},
  {code:'WSM' , name: 'Samoa'},
  {code:'SMR' , name: 'San Marino'},
  {code:'STP' , name: 'Sao Tome And Principe'},
  {code:'SAU' , name: 'Saudi Arabia'},
  {code:'SEN' , name: 'Senegal'},
  {code:'SRB' , name: 'Serbia'},
  {code:'SYC' , name: 'Seychelles'},
  {code:'SLE' , name: 'Sierra Leone'},
  {code:'SGP' , name: 'Singapore'},
  {code:'SVK' , name: 'Slovakia'},
  {code:'SVN' , name: 'Slovenia'},
  {code:'SLB' , name: 'Solomon Islands'},
  {code:'SOM' , name: 'Somalia'},
  {code:'ZAF' , name: 'South Africa'},
  {code:'SGS' , name: 'South Georgia And Sandwich Isl.'},
  {code:'ESP' , name: 'Spain'},
  {code:'LKA' , name: 'Sri Lanka'},
  {code:'SSD' , name: 'Sudan'},
  {code:'SUR' , name: 'Suriname'},
  {code:'SJM' , name: 'Svalbard And Jan Mayen'},
  {code:'SWZ' , name: 'Swaziland'},
  {code:'SWE' , name: 'Sweden'},
  {code:'CHE' , name: 'Switzerland'},
  {code:'SYR' , name: 'Syrian Arab Republic'},
  {code:'TWN' , name: 'Taiwan'},
  {code:'TJK' , name: 'Tajikistan'},
  {code:'TAZ' , name: 'Tanzania'},
  {code:'THA' , name: 'Thailand'},
  {code:'TLS' , name: 'Timor-Leste'},
  {code:'TGO' , name: 'Togo'},
  {code:'TKL' , name: 'Tokelau'},
  {code:'TON' , name: 'Tonga'},
  {code:'TTO' , name: 'Trinidad And Tobago'},
  {code:'TUN' , name: 'Tunisia'},
  {code:'TUR' , name: 'Turkey'},
  {code:'TKM' , name: 'Turkmenistan'},
  {code:'TCA' , name: 'Turks And Caicos Islands'},
  {code:'TUV' , name: 'Tuvalu'},
  {code:'UGA' , name: 'Uganda'},
  {code:'UKR' , name: 'Ukraine'},
  {code:'ARE' , name: 'United Arab Emirates'},
  {code:'GBR' , name: 'United Kingdom'},
  {code:'USA' , name: 'United States'},
  {code:'UMI' , name: 'United States Outlying Islands'},
  {code:'URY' , name: 'Uruguay'},
  {code:'UZB' , name: 'Uzbekistan'},
  {code:'VUT' , name: 'Vanuatu'},
  { code: 'VEN' , name: 'Venezuela'},
  { code: 'VNM' , name: 'Viet Nam'},
  { code: 'VIB' , name: 'Virgin Islands, British'},
  { code: 'VIR' , name: 'Virgin Islands, U.S.'},
  { code: 'WLF' , name: 'Wallis And Futuna'},
  { code: 'ESH' , name: 'Western Sahara'},
  { code: 'YEM' , name: 'Yemen'},
  { code: 'ZMB' , name: 'Zambia'},
  { code: 'ZWE' , name: 'Zimbabwe'}
];



countryCode = [
  {code:'93' , name: 'Afghanistan'},
  {code:'358' , name: 'Aland Islands'},
  {code:'355' , name: 'Albania'},
  {code:'213' , name: 'Algeria'},
  {code:'684' , name: 'American Samoa'},
  {code:'376' , name: 'Andorra'},
  {code:'244' , name: 'Angola'},
  {code:'1' , name: 'Anguilla'},
  {code:'672' , name: 'Antarctica'},
  {code:'1' , name: 'Antigua And Barbuda'},
  {code:'54' , name: 'Argentina'},
  {code:'374' , name: 'Armenia'},
  {code:'297' , name: 'Aruba'},
  {code:'61' , name: 'Australia'},
  {code:'43' , name: 'Austria'},
  {code:'994' , name: 'Azerbaijan'},
  {code:'1' , name: 'Bahamas'},
  {code:'973' , name: 'Bahrain'},
  {code:'880' , name: 'Bangladesh'},
  {code:'1' , name: 'Barbados'},
  {code:'375' , name: 'Belarus'},
  {code:'32' , name: 'Belgium'},
  {code:'501' , name: 'Belize'},
  {code:'229' , name: 'Benin'},
  {code:'1' , name: 'Bermuda'},
  {code:'975' , name: 'Bhutan'},
  {code:'591' , name: 'Bolivia'},
  {code:'387' , name: 'Bosnia And Herzegovina'},
  {code:'267' , name: 'Botswana'},
  {code:'011' , name: 'Bouvet Island'},
  {code:'55' , name: 'Brazil'},
  {code:'1' , name: 'British Indian Ocean Territory'},
  {code:'673' , name: 'Brunei Darussalam'},
  {code:'359' , name: 'Bulgaria'},
  {code:'226' , name: 'Burkina Faso'},
  {code:'257' , name: 'Burundi'},
  {code:'855' , name: 'Cambodia'},
  {code:'237' , name: 'Cameroon'},
  {code:'1' , name: 'Canada'},
  {code:'238' , name: 'Cape Verde'},
  {code:'1' , name: 'Cayman Islands'},
  {code:'236' , name: 'Central African Republic'},
  {code:'235' , name: 'Chad'},
  {code:'56' , name: 'Chile'},
  {code:'86' , name: 'China'},
  {code:'61' , name: 'Christmas Island'},
  {code:'891' , name: 'Cocos (Keeling) Islands'},
  {code:'57' , name: 'Colombia'},
  {code:'269' , name: 'Comoros'},
  {code:'242' , name: 'Congo'},
  {code:'242' , name: 'Congo, Democratic Republic'},
  {code:'682' , name: 'Cook Islands'},
  {code:'506' , name: 'Costa Rica'},
  {code:'225' , name: 'Cote D\'Ivoire'},
  {code:'385' , name: 'Croatia'},
  {code:'53' , name: 'Cuba'},
  {code:'357' , name: 'Cyprus'},
  {code:'420' , name: 'Czech Republic'},
  {code:'45' , name: 'Denmark'},
  {code:'253' , name: 'Djibouti'},
  {code:'1' , name: 'Dominica'},
  {code:'1' , name: 'Dominican Republic'},
  {code:'593' , name: 'Ecuador'},
  {code:'20' , name: 'Egypt'},
  {code:'503' , name: 'El Salvador'},
  {code:'240' , name: 'Equatorial Guinea'},
  {code:'291' , name: 'Eritrea'},
  {code:'372' , name: 'Estonia'},
  {code:'251' , name: 'Ethiopia'},
  {code:'500' , name: 'Falkland Islands (Malvinas)'},
  {code:'298' , name: 'Faroe Islands'},
  {code:'679' , name: 'Fiji'},
  {code:'358' , name: 'Finland'},
  {code:'33' , name: 'France'},
  {code:'594' , name: 'French Guiana'},
  {code:'689' , name: 'French Polynesia'},
  {code:'262' , name: 'French Southern Territories'},
  {code:'241' , name: 'Gabon'},
  {code:'220' , name: 'Gambia'},
  {code:'995' , name: 'Georgia'},
  {code:'49' , name: 'Germany'},
  {code:'233' , name: 'Ghana'},
  {code:'350' , name: 'Gibraltar'},
  {code:'30' , name: 'Greece'},
  {code:'299' , name: 'Greenland'},
  {code:'1' , name: 'Grenada'},
  {code:'590' , name: 'Guadeloupe'},
  {code:'1' , name: 'Guam'},
  {code:'502' , name: 'Guatemala'},
  {code:'44' , name: 'Guernsey'},
  {code:'224' , name: 'Guinea'},
  {code:'245' , name: 'Guinea-Bissau'},
  {code:'592' , name: 'Guyana'},
  {code:'509' , name: 'Haiti'},
  {code:'0' , name: 'Heard Island & Mcdonald Islands'},
  {code:'379' , name: 'Holy See (Vatican City State)'},
  {code:'504' , name: 'Honduras'},
  {code:'852' , name: 'Hong Kong'},
  {code:'36' , name: 'Hungary'},
  {code:'354' , name: 'Iceland'},
  {code:'91' , name: 'India'},
  {code:'62' , name: 'Indonesia'},
  {code:'98' , name: 'Iran, Islamic Republic Of'},
  {code:'964' , name: 'Iraq'},
  {code:'353' , name: 'Ireland'},
  {code:'44' , name: 'Isle Of Man'},
  {code:'972' , name: 'Israel'},
  {code:'39' , name: 'Italy'},
  {code:'1' , name: 'Jamaica'},
  {code:'81' , name: 'Japan'},
  {code:'44' , name: 'Jersey'},
  {code:'962' , name: 'Jordan'},
  {code:'7' , name: 'Kazakhstan'},
  {code:'254' , name: 'Kenya'},
  {code:'686' , name: 'Kiribati'},
  {code:'82' , name: 'Korea'},
  {code:'82' , name: 'Korea, Republic of'},
  {code:'965' , name: 'Kuwait'},
  {code:'996' , name: 'Kyrgyzstan'},
  {code:'856' , name: 'Lao People\'s Democratic Republic'},
  {code:'371' , name: 'Latvia'},
  {code:'961' , name: 'Lebanon'},
  {code:'266' , name: 'Lesotho'},
  {code:'231' , name: 'Liberia'},
  {code:'218' , name: 'Libyan Arab Jamahiriya'},
  {code:'423' , name: 'Liechtenstein'},
  {code:'370' , name: 'Lithuania'},
  {code:'352' , name: 'Luxembourg'},
  {code:'853' , name: 'Macao'},
  {code:'389' , name: 'Macedonia'},
  {code:'261' , name: 'Madagascar'},
  {code:'265' , name: 'Malawi'},
  {code:'60' , name: 'Malaysia'},
  {code:'960' , name: 'Maldives'},
  {code:'223' , name: 'Mali'},
  {code:'356' , name: 'Malta'},
  {code:'692' , name: 'Marshall Islands'},
  {code:'596' , name: 'Martinique'},
  {code:'222' , name: 'Mauritania'},
  {code:'230' , name: 'Mauritius'},
  {code:'269' , name: 'Mayotte'},
  {code:'52' , name: 'Mexico'},
  {code:'691' , name: 'Micronesia, Federated States Of'},
  {code:'373' , name: 'Moldova'},
  {code:'377' , name: 'Monaco'},
  {code:'976' , name: 'Mongolia'},
  {code:'382' , name: 'Montenegro'},
  {code:'1' , name: 'Montserrat'},
  {code:'212' , name: 'Morocco'},
  {code:'258' , name: 'Mozambique'},
  {code:'95' , name: 'Myanmar'},
  {code:'264' , name: 'Namibia'},
  {code:'674' , name: 'Nauru'},
  {code:'977' , name: 'Nepal'},
  {code:'31' , name: 'Netherlands'},
  {code:'599' , name: 'Netherlands Antilles'},
  {code:'687' , name: 'New Caledonia'},
  {code:'64' , name: 'New Zealand'},
  {code:'505' , name: 'Nicaragua'},
  {code:'227' , name: 'Niger'},
  {code:'234' , name: 'Nigeria'},
  {code:'683' , name: 'Niue'},
  {code:'672' , name: 'Norfolk Island'},
  {code:'1' , name: 'Northern Mariana Islands'},
  {code:'47' , name: 'Norway'},
  {code:'968' , name: 'Oman'},
  {code:'92' , name: 'Pakistan'},
  {code:'680' , name: 'Palau'},
  {code:'970' , name: 'Palestinian Territory, Occupied'},
  {code:'507' , name: 'Panama'},
  {code:'675' , name: 'Papua New Guinea'},
  {code:'595' , name: 'Paraguay'},
  {code:'51' , name: 'Peru'},
  {code:'63' , name: 'Philippines'},
  {code:'64' , name: 'Pitcairn'},
  {code:'48' , name: 'Poland'},
  {code:'351' , name: 'Portugal'},
  {code:'1' , name: 'Puerto Rico'},
  {code:'974' , name: 'Qatar'},
  {code:'262' , name: 'Reunion'},
  {code:'40' , name: 'Romania'},
  {code:'7' , name: 'Russian Federation'},
  {code:'250' , name: 'Rwanda'},
  {code:'590' , name: 'Saint Barthelemy'},
  {code:'290' , name: 'Saint Helena'},
  {code:'1' , name: 'Saint Kitts And Nevis'},
  {code:'1' , name: 'Saint Lucia'},
  {code:'1' , name: 'Saint Martin'},
  {code:'508' , name: 'Saint Pierre And Miquelon'},
  {code:'1' , name: 'Saint Vincent And Grenadines'},
  {code:'685' , name: 'Samoa'},
  {code:'378' , name: 'San Marino'},
  {code:'239' , name: 'Sao Tome And Principe'},
  {code:'966' , name: 'Saudi Arabia'},
  {code:'221' , name: 'Senegal'},
  {code:'381' , name: 'Serbia'},
  {code:'248' , name: 'Seychelles'},
  {code:'232' , name: 'Sierra Leone'},
  {code:'65' , name: 'Singapore'},
  {code:'421' , name: 'Slovakia'},
  {code:'386' , name: 'Slovenia'},
  {code:'677' , name: 'Solomon Islands'},
  {code:'252' , name: 'Somalia'},
  {code:'27' , name: 'South Africa'},
  {code:'500' , name: 'South Georgia And Sandwich Isl.'},
  {code:'34' , name: 'Spain'},
  {code:'94' , name: 'Sri Lanka'},
  {code:'249' , name: 'Sudan'},
  {code:'597' , name: 'Suriname'},
  {code:'47' , name: 'Svalbard And Jan Mayen'},
  {code:'268' , name: 'Swaziland'},
  {code:'46' , name: 'Sweden'},
  {code:'41' , name: 'Switzerland'},
  {code:'963' , name: 'Syrian Arab Republic'},
  {code:'886' , name: 'Taiwan'},
  {code:'992' , name: 'Tajikistan'},
  {code:'225' , name: 'Tanzania'},
  {code:'66' , name: 'Thailand'},
  {code:'670' , name: 'Timor-Leste'},
  {code:'228' , name: 'Togo'},
  {code:'690' , name: 'Tokelau'},
  {code:'676' , name: 'Tonga'},
  {code:'1' , name: 'Trinidad And Tobago'},
  {code:'216' , name: 'Tunisia'},
  {code:'90' , name: 'Turkey'},
  {code:'993' , name: 'Turkmenistan'},
  {code:'1' , name: 'Turks And Caicos Islands'},
  {code:'688' , name: 'Tuvalu'},
  {code:'256' , name: 'Uganda'},
  {code:'380' , name: 'Ukraine'},
  {code:'971' , name: 'United Arab Emirates'},
  {code:'44' , name: 'United Kingdom'},
  {code:'1' , name: 'United States'},
  {code:'1' , name: 'United States Outlying Islands'},
  {code:'598' , name: 'Uruguay'},
  {code:'998' , name: 'Uzbekistan'},
  {code:'678' , name: 'Vanuatu'},
  { code: '58' , name: 'Venezuela'},
  { code: '84' , name: 'Viet Nam'},
  { code: '1' , name: 'Virgin Islands, British'},
  { code: '1' , name: 'Virgin Islands, U.S.'},
  { code: '681' , name: 'Wallis And Futuna'},
  { code: '212' , name: 'Western Sahara'},
  { code: '967' , name: 'Yemen'},
  { code: '260' , name: 'Zambia'},
  { code: '263' , name: 'Zimbabwe'}
];


fileUploadResponse:any;
fileUploadUrl:any;


fsFileUpload() {
  
  let fsClient = filestack.init(fsKey);
  let fileAccepted = ["image/*"];
  let maxSize = 10485760;
  
  let fileOptions = {
    fromSources:["local_file_system"],
    accept: fileAccepted,
    maxFiles:1,
    minFiles:1,
    transformations:{
      crop:true,
      circle:false
    },
    maxSize:maxSize
  };
  fsClient.pick(fileOptions).then((response) => {
    // console.log(response);
    this.fileUploadResponse = response.filesUploaded[0];
    this.fileUploadUrl = this.fileUploadResponse.url;
    // console.log(this.fileUploadUrl);
    this.uploadProfileImage();
  });
}

uploadProfileImage(){
  
  this.showLoader = true;
  this.profilePic = false;

                       this.idUser = this._lstore.getLocalItems('user');

                       let data = {
                        idUser: this.idUser,
                        image: this.fileUploadUrl,

                };
                this._req.fetchApiData(this._urls.updateProfileImageUrl,data).subscribe(
                 (data:any) => {
                      this.userDetails(); 
                  
                  
                },
                 error => {
           
                 },
                 () => {
           
                 })
}


  updateUserDocumentForm:FormGroup;
  updateUserDocumentFormValidate:boolean=false;
  updateUserDocumentFormresponseSuccess:boolean = false;
  updateUserDocumentFormdisableButton:boolean = false;
  updateUserDocumentFormshowLoader:boolean = false;
  updateUserDocumentFormregisterComplete:boolean = false;
  updateUserDocumentMesg:any = "";

  updateUserDocumentFormInit(){

    this.updateUserDocumentForm = this._fb.group({
      'supportDocType': ['',[Validators.required]],
},

{ updateOn: 'blur' });
}

updateUserDocumentSubmit(){
    let formVal = this.updateUserDocumentForm.value;
    let documentInfo = this.getDocumentDetails();

    this.updateUserDocumentFormValidate = true;
    if (this.updateUserDocumentForm.valid) {
      this.updateUserDocumentFormshowLoader = true;
      this.updateUserDocumentFormdisableButton = true;
      this.idUser = this._lstore.getLocalItems('user');

      let data = {
        idUser: this.idUser,
        supportDocType : formVal.supportDocType ,
        documentInfo : this.getDocumentDetails()

};

               this._req.fetchApiData(this._urls.upgradeGoldUrl,data).subscribe(
               (data:any) => {

                // console.log('update',data);

                this.updateUserDocumentFormshowLoader = false;
                this.updateUserDocumentFormresponseSuccess = true;
                this.updateUserDocumentFormdisableButton = false;
                let response = data;

                if(response.data == '') {
                 this.updateUserDocumentFormshowLoader = false;

                 if( response.error != '' ){
                   this.updateUserDocumentFormshowLoader = false;
                   this.updateUserDocumentFormdisableButton = false;
                   this.updateUserDocumentMesg=response.error['Error Description'];
                  //  console.log(this.updateUserFinancialMesg);
                   this.updateUserDocumentFormresponseSuccess = false;

                 }
                 
                 }
                 else{
                 this.updateUserDocumentFormshowLoader = false;
                 this.updateUserDocumentFormdisableButton = false;
                 this.updateUserDocumentMesg = "Details Updated Successfully";
                //  console.log(this.updateUserDocumentMesg);
                 this.updateUserDocumentFormresponseSuccess = true;
                 }

                 setTimeout(()=>{
                   this.userDetails();
                   this.userUpdatePage = false;
                   this.updateUserDocumentMesg ="";
                   this.fileName="";
                   this.fileSupportName="";
                 },1500);        
  },
  error => {

  },
  () => {

  })
    }
}



  fileUploadPofResponse:any;
  fileUploadPofUrl:any;
  fileName:any;

  fsFileUpgrade() {
    let fsClient = filestack.init(fsKey);
    let fileAccepted = [".pdf",".doc",".docx",".docm","image/*"];
    let maxSize = 10485760;
    
    let fileOptions = {
      fromSources:["local_file_system"],
      accept: fileAccepted,
      maxFiles:1,
      minFiles:1,
      transformations:{
        crop:true,
        circle:false
      },
      maxSize:maxSize
    };
    fsClient.pick(fileOptions).then((response) => {
      // console.log(response);
      this.fileUploadPofResponse = response.filesUploaded[0];
      this.fileUploadPofUrl = this.fileUploadPofResponse.url;
      this.fileName = this.fileUploadPofResponse.filename;
      // console.log(this.fileUploadPofUrl);
    });
  }


  fileUploadPofsResponse:any;
  fileUploadPofsUrl:any;
  fileSupportName:any;
  
  fsFileUpgrade1() {
    let fsClient = filestack.init(fsKey);
    let fileAccepted = [".pdf",".doc",".docx",".docm","image/*"];
    let maxSize = 10485760;
    
    let fileOptions = {
      fromSources:["local_file_system"],
      accept: fileAccepted,
      maxFiles:1,
      minFiles:1,
      transformations:{
        crop:true,
        circle:false
      },
      maxSize:maxSize
    };
    fsClient.pick(fileOptions).then((response) => {
      // console.log(response);
      this.fileUploadPofsResponse = response.filesUploaded[0];
      this.fileUploadPofsUrl = this.fileUploadPofsResponse.url;
      this.fileSupportName = this.fileUploadPofsResponse.filename;
      // console.log(this.fileUploadPofsUrl);
    });
  }

  supportType:any;
  getDocumentDetails() {
    let formVal = this.updateUserDocumentForm.value;
    this.supportType =  formVal.supportDocType;
    let files = [];
     {
      files.push({
        docTitle: 'Proof of funds',
        docName: this.fileUploadPofUrl,
        docType: 'POF'
      })
    }
     {
        switch (this.supportType)
        {
            case 'POFS1':
            {
              files.push({
                docTitle: 'Custody statements',
                docName: this.fileUploadPofsUrl,
                docType: 'POFS1'
              })
            }
            break;

            case 'POFS2':
            {
              files.push({
                docTitle: 'real estate ownership',
                docName: this.fileUploadPofsUrl,
                docType: 'POFS2'
              })
            }
            break;

            case 'POFS3':
            {
              files.push({
                docTitle: 'account statement',
                docName: this.fileUploadPofsUrl,
                docType: 'POFS3'
              })
            }
            break;

        }
      
    }

    return files;
  }


  languageName:any;

localeDetails(){
  let data = {
};
this._req.fetchApiData(this._urls.getLocaleUrl,data).subscribe(
  (data:any) => {
   
        this.localeName = data.data;
        this.languageName = this.localeName.languageName;

 },
  error => {

  },
  () => {

  })
}








userType:string = '';
userTypedisplay:any = '';

checkUserType(type) {
  switch (type) {
    case 'Admin':

      break;
    case 'Issuer':

      break;
    default:
      break;
  }
}

getStoragesItem() {

  let userType = this._lstore.getLocalItems('userType');
  if( userType != null ) {
    this.userTypedisplay = userType;
  }
  console.log(this.userTypedisplay);
  // console.log('this.companyInfo',company);
}

updatePreferenceForm:FormGroup;
updatePreferenceFormValidate:boolean=false;
updatePreferenceFormresponseSuccess:boolean = false;
updatePreferenceFormdisableButton:boolean = false;
updatePreferenceFormshowLoader:boolean = false;
updatePreferenceFormregisterComplete:boolean = false;
updatePreferenceFormMesg:any = "";
  
userPreferenceFormInit(){

  this.updatePreferenceForm = this._fb.group({
    'theme_switcher': [''],
    'language': [''],
    'chartType': ['']
   
},

{ updateOn: 'blur'});
}




userPreferenceFormSubmit(){

  let formVal = this.updatePreferenceForm.value;
  this.updatePreferenceFormValidate = true;

  if (this.updatePreferenceForm.valid) {
    this.updatePreferenceFormshowLoader = true;
    this.updatePreferenceFormdisableButton = true;
    this.idUser = this._lstore.getLocalItems('user');

    let data = {
      idUser: this.idUser,
      preferredTheme : formVal.theme_switcher,
      idLocale : formVal.language,
      preferredChart : formVal.chartType

};

             this._req.fetchApiData(this._urls.userPreferenceUrl,data).subscribe(
             (data:any) => {

              // console.log('update',data);

              this.updatePreferenceFormshowLoader = false;
              this.updatePreferenceFormresponseSuccess = true;
              this.updatePreferenceFormdisableButton = false;
              let response = data;

              if(response.data == '') {
               this.updatePreferenceFormshowLoader = false;

               if( response.error != '' ){
                 this.updatePreferenceFormshowLoader = false;
                 this.updatePreferenceFormdisableButton = false;
                 this.updatePreferenceFormMesg=response.error['Error Description'];
                //  console.log(this.updateUserFinancialMesg);
                 this.updatePreferenceFormresponseSuccess = false;

               }
               
               }
               else{
               this.updatePreferenceFormshowLoader = false;
               this.updatePreferenceFormdisableButton = false;
               this.updatePreferenceFormMesg = "Details Updated Successfully";
              //  console.log(this.updateUserDocumentMesg);
               this.updatePreferenceFormresponseSuccess = true;
               }

               setTimeout(()=>{
                 this.userDetails();
               },1500);        
},
error => {

},
() => {

})
  }
}

userPreferenceFormReset(){

  this.updatePreferenceFormValidate = true;
  
    this.updatePreferenceFormshowLoader = true;
    this.updatePreferenceFormdisableButton = true;
    this.idUser = this._lstore.getLocalItems('user');

    let data = {
      idUser: this.idUser,
      preferredTheme : '1',
      idLocale : '1',
      preferredChart : 'Candlestick'

};

             this._req.fetchApiData(this._urls.userPreferenceUrl,data).subscribe(
             (data:any) => {

              // console.log('update',data);

              this.updatePreferenceFormshowLoader = false;
              this.updatePreferenceFormresponseSuccess = true;
              this.updatePreferenceFormdisableButton = false;
              let response = data;

              if(response.data == '') {
               this.updatePreferenceFormshowLoader = false;

               if( response.error != '' ){
                 this.updatePreferenceFormshowLoader = false;
                 this.updatePreferenceFormdisableButton = false;
                 this.updatePreferenceFormMesg=response.error['Error Description'];
                //  console.log(this.updateUserFinancialMesg);
                 this.updatePreferenceFormresponseSuccess = false;

               }               
               }

               else{
               this.updatePreferenceFormshowLoader = false;
               this.updatePreferenceFormdisableButton = false;
               this.updatePreferenceFormMesg = "Details Resetted Successfully";
              //  console.log(this.updateUserDocumentMesg);
               this.updatePreferenceFormresponseSuccess = true;
               }

               setTimeout(()=>{
                 this.userDetails();
               },1500);        
},
error => {

},
() => {

})
  }

dayThemeEnabled:boolean = true;
toggle = false;
 
theme:any;
fontword:any;
fontwordInverse:any;
blueChange:any;

selectedDayTheme(){

  this.dayThemeEnabled = !this.dayThemeEnabled;
  this.toggle = !this.toggle;

  this.theme        =   document.getElementById("theme_change");
  this.theme.style.background = "#f5f5f5";
}
selectedNightTheme(){

  this.dayThemeEnabled = !this.dayThemeEnabled;
  this.toggle = !this.toggle;
  
  this.theme        =   document.getElementById("theme_change");
  this.theme.style.background = "#2f3032";
}



  ngOnInit() {
    this.scrollToTop();
    this.updateUserDetailInit();
    this.updateUserFinancialInit();
    this.updateUserDocumentFormInit();
    this.userPreferenceFormInit();
    this.userDetails();
    this.localeDetails();
    this.checkUserType(this.userTypedisplay);
    this.getStoragesItem();
    console.log(this.userType);
  }

}
