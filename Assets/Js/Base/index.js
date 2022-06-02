function CreateMessage_Alert(Text, FuncWhenOK, ValueFunc = null, FuncWhenCancel = null) {
    CloseMessage_Alert()
    LockAllElements()
    setTimeout(function () {
        document.body.className = ''

        let Container = document.createElement('div')
        let TextMessage = document.createElement('p')
        let BtnClose = document.createElement('button')
        let BtnOk = document.createElement('button')
        let BtnClose1 = document.createElement('i')


        Container.className = 'ContainerMessage_Alert'
        TextMessage.className = 'TextMessage_Alert'
        BtnClose.className = 'BtnClose_Alert BtnStyle_1'
        BtnOk.className = 'BtnOk_Alert BtnStyle_1'
        BtnClose1.className = 'fa fa-times BtnClose1_Alert'

        TextMessage.innerHTML = Text
        BtnClose.innerText = 'Cancel'
        BtnOk.innerText = 'Yes'

        BtnClose.onclick = function () {
            if (FuncWhenCancel != null) {
                FuncWhenCancel()
            }
            CloseMessage_Alert()
        }
        BtnClose1.onclick = function () {
            if (FuncWhenCancel != null) {
                FuncWhenCancel()
            }
            CloseMessage_Alert()
        }

        BtnOk.onclick = function () {
            if (ValueFunc != null) {
                FuncWhenOK(ValueFunc)
            } else {
                FuncWhenOK()
            }
            CloseMessage_Alert()
        }

        Container.appendChild(TextMessage)
        Container.appendChild(BtnClose)
        Container.appendChild(BtnClose1)
        Container.appendChild(BtnOk)
        ClickOutSideContainer(Container, function () {
            CloseMessage_Alert()
        }, 'OutSide')
        document.body.insertBefore(Container, document.body.firstElementChild)
        BlurAllElementsExceptMessage_Alert()

        // Focus on Button Close
        BtnOk.focus()
    })
}

function CloseMessage_Alert() {
    try {
        document.getElementsByClassName('ContainerMessage_Alert')[0].remove()
    } catch (e) {
    }
    UnlockAllElements()
    Clear_BlurAllElementsExceptMessage_Alert()
}

function BlurAllElementsExceptMessage_Alert() {
    document.body.classList.add('BlurAllElementsExceptMessage_Alert')
    document.body.style.overflow = 'hidden'
}

function Clear_BlurAllElementsExceptMessage_Alert() {
    document.body.classList.remove('BlurAllElementsExceptMessage_Alert')
    document.body.style.overflow = ''
}


////////////////////////////////////   Slider       /////////////////////////////////

let Sliders = document.querySelectorAll('.Sliders')
for (let i of Sliders) {
    i.setAttribute('LengthSlider', i.querySelectorAll('.Slider').length)
    i.setAttribute('IndexElementActive', '0')
    if (i.getAttribute('Timer') != null && i.getAttribute('Timer') != '') {
        i.setAttribute('StateTimer', 'Active')
        TimingSlider(i)
    }
}


function ChangeSlider(ContainerSlider, Type, Btn) {
    let LenSlider = ContainerSlider.querySelectorAll('.Slider').length
    if (LenSlider != '0') {


        ContainerSlider.setAttribute('StateTimer', 'Disabled')

        if (Btn == 'Active') {
            let Prev_Next = null
            if (Type == 'Next') {
                ContainerSlider.setAttribute('IndexElementActive', Number(ContainerSlider.getAttribute('IndexElementActive')) - 1)
                Prev_Next = -1
            } else {
                ContainerSlider.setAttribute('IndexElementActive', Number(ContainerSlider.getAttribute('IndexElementActive')) + 1)
                Prev_Next = 1
            }
            if (Number(ContainerSlider.getAttribute('IndexElementActive')) < 0) {
                ContainerSlider.setAttribute('IndexElementActive', 0)
            }
            let Sliders = ContainerSlider.querySelectorAll('.Slider')
            let ElementActive = ContainerSlider.querySelector('.SliderActive')
            let IndexNextElementActive = Array.prototype.slice.call(Sliders).indexOf(ElementActive) + Prev_Next
            ElementActive.classList.remove('SliderActive')
            try {
                Sliders[IndexNextElementActive].classList.add('SliderActive')
            } catch (e) {
                Sliders[0].classList.add('SliderActive')
            }


            if (Number(ContainerSlider.getAttribute('LengthSlider')) - 1 == ContainerSlider.getAttribute('IndexElementActive')) {
                ContainerSlider.querySelector('.BtnPrevSlider').setAttribute('State', 'Disabled')
            } else {
                ContainerSlider.querySelector('.BtnPrevSlider').setAttribute('State', 'Active')
            }

            if (ContainerSlider.getAttribute('IndexElementActive') == 0) {
                ContainerSlider.querySelector('.BtnNextSlider').setAttribute('State', 'Disabled')
            } else {
                ContainerSlider.querySelector('.BtnNextSlider').setAttribute('State', 'Active')
            }
        }
        ContainerSlider.setAttribute('StateTimer', 'Active')
    }
}

function TimingSlider(Slider) {
    let StateTimer = Slider.getAttribute('StateTimer')
    let Timer = Slider.getAttribute('Timer')
    setInterval(function () {
        if (StateTimer == 'Active') {
            let BtnPrevSlider = Slider.querySelector('.BtnPrevSlider')
            let BtnNextSlider = Slider.querySelector('.BtnNextSlider')
            let IndexElementActive = Number(Slider.getAttribute('IndexElementActive'))
            let LengthSlider = Number(Slider.getAttribute('LengthSlider'))

            ChangeSlider(Slider, 'Prev', BtnPrevSlider.getAttribute('State'))

            if (IndexElementActive == LengthSlider - 1) {
                BtnNextSlider.setAttribute('State', 'Disabled')
                Slider.children[IndexElementActive].classList.remove('SliderActive')
                Slider.firstElementChild.classList.add('SliderActive')
                Slider.setAttribute('IndexElementActive', 0)
                BtnPrevSlider.setAttribute('State', 'Active')
            }
        }
    }, Timer)
}

function ScrollOnElement(ID_Element, Element = null) {
    if (ID_Element == null) {
        try {
            window.scrollTo(0, Element.scrollTop)
        } catch (e) {
        }
    }
    try {
        let Element = document.getElementById(ID_Element)
        window.scrollTo(0, Element.scrollTop) || Element.scrollIntoView()
    } catch (e) {
        // Element.scrollIntoView()
        window.scrollTo(0, Element.scrollTop)
    }
}

function SetTextInClipBoard(Text, ShowMessage = true) {
    navigator.clipboard.writeText(Text)
    ShowNotificationMessage('متن کپی شد', 'Success')
}

function GoToTopPage() {
    window.scrollTo(0, 0)
}

function GoToUrl(Url, Target = 'Self') {

    if (Target == 'Self') {
        window.location.href = Url
    } else if (Target == 'Blank') {
        window.open(Url, '_blank')
    }
}

function GoToProduct(Slug) {
    window.open(`/Product/${Slug}`, '_blank');
}


function CloseContainerProducts(ID_Container) {
    document.getElementById(ID_Container).classList.add('d-none')
    ClearEffectOnBody()
}

function ClearEffectOnBody() {
    document.body.removeAttribute('class')
}


function SendAjax(Url, Data = {}, Method = 'POST', Success, Failed) {
    function __Redirect__(response) {
        if (response.__Redirect__ == 'True') {
            setTimeout(function () {
                window.location.href = response.__RedirectURL__
            }, parseInt(response.__RedirectAfter__ || 0))
        }
    }

    function Loading(State) {
        if (State == 'Show') {
            let ContainerLoading = document.createElement('div')
            let CircleLoading = document.createElement('div')
            ContainerLoading.id = 'ContainerLoadingAJAX'
            ContainerLoading.classList.add('ContainerLoadingAJAX')
            ContainerLoading.innerHTML = `
                <div class="LoadingCircle"><span></span></div>
            `
            document.body.appendChild(ContainerLoading)
        } else {
            try {
                document.getElementById('ContainerLoadingAJAX').remove()
            } catch (e) {
            }
        }
    }

    if (Success == undefined) {
        Success = function (response) {
            __Redirect__(response)
        }
    }
    if (Failed == undefined) {
        Failed = function (response) {
            ShowNotificationMessage('ارتباط با سرور بر قرار نشد ', 'Error', 30000, 2)
        }
    }
    //Loading('Show')
    $.ajax(
        {
            url: Url,
            data: JSON.stringify(Data),
            type: Method,
            success: function (response) {
                __Redirect__(response)
                //Loading('Hide')
                Success(response)
            },
            failed: function (response) {
                __Redirect__(response)
                //Loading('Hide')
                Failed(response)
            },
            error: function (response) {
                __Redirect__(response)
                //Loading('Hide')
                Failed(response)
            }
        }
    )
}


let LIST_ALL_NOTIFICATIONS_INSTANCE = []
let COUNTER_CREATE_NOTIFICATIONS = 0

class ShowNotificationMessage_Model {
    constructor(Text, Type, Timer = 5000, LevelOfNecessity = 3) {
        COUNTER_CREATE_NOTIFICATIONS += 1
        LIST_ALL_NOTIFICATIONS_INSTANCE.push(this)
        this.ID_Notification = COUNTER_CREATE_NOTIFICATIONS
        this.Index_Notification = LIST_ALL_NOTIFICATIONS_INSTANCE.length - 1

        let ContainerNotifications = document.getElementById('ContainerNotificationsMessage')
        if (ContainerNotifications == undefined) {
            ContainerNotifications = document.createElement('div')
            ContainerNotifications.id = 'ContainerNotificationsMessage'
        }
        let ContainerMessage = document.createElement('div')
        let Message = document.createElement('p')
        let BtnClose = document.createElement('i')
        let Icon = document.createElement('i')

        ContainerMessage.setAttribute('ID_Notification', this.ID_Notification)
        BtnClose.setAttribute('Index_Notification', this.Index_Notification)

        ContainerMessage.classList.add('NotificationMessage')
        ContainerMessage.classList.add(`LevelOfNecessity_${LevelOfNecessity}`)
        ContainerMessage.classList.add(`Notification${Type}`)
        Message.innerText = Text
        BtnClose.className = 'fa fa-times BtnCloseNotification'
        if (Type == 'Success') {
            Icon.className = 'fa fa-check-circle IconNotification IconNotification_Success'
        } else if (Type == 'Error') {
            Icon.className = 'fa fa-times-hexagon IconNotification IconNotification_Error '
        } else if (Type == 'Warning') {
            Icon.className = 'fa fa-exclamation-triangle IconNotification IconNotification_Warning'
        }
        ContainerMessage.appendChild(Icon)
        ContainerMessage.appendChild(BtnClose)
        ContainerMessage.appendChild(Message)
        ContainerNotifications.appendChild(ContainerMessage)
        document.body.appendChild(ContainerNotifications)
        this.ContainerMessage = ContainerMessage
        let Index_Notification = this.Index_Notification
        setTimeout(function () {
            RemoveNotification_Func(Index_Notification)
        }, Timer)

        BtnClose.onclick = function (e) {
            let Index_Notification = e.target.getAttribute('Index_Notification')
            RemoveNotification_Func(Index_Notification)
        }
    }

}

function RemoveNotification_Func(Index) {
    let Instance = LIST_ALL_NOTIFICATIONS_INSTANCE[Index]
    Instance.ContainerMessage.classList.add('Notification_Removed')
    setTimeout(function () {
        Instance.ContainerMessage.remove()
        delete Instance
    }, 300)
}

function ShowNotificationMessage(Text, Type, Timer = 5000, LevelOfNecessity = 3) {
    new ShowNotificationMessage_Model(Text, Type, Timer, LevelOfNecessity)
}

function ValidListInputs(Inputs) {
    let State = true
    for (let Input of Inputs) {
        let Valid = Input.getAttribute('Valid')
        if (Valid == false || Valid == null || Valid == undefined) {
            State = false
        }
    }
    return State
}

function IsBlank(Value) {
    return (!Value || /^\s*$/.test(Value));
}


function CheckInputValidations(Input, Bigger, Less, SetIn = 'Input', Type = 'Text', NoSpace = false) {
    let State
    let Value = Input.value
    let ValueLength = Value.length
    if (Type == 'Email') {
        Value = ValidationEmail(Value)
    }
    if (Type == 'Number') {
        Value = ValidationIsNumber(Value)
    }
    // if (Type == 'Password') {
    //     Input.value = Value.replace(/\s+/g, '')
    //     Value = Input.value
    //     if (ValidationAllCharIsEnglish(null, Value, 'Value') == false) {
    //         // Input.value = String(Input.value).slice(0,-1)
    //         Input.setAttribute('Valid', 'false')
    //         State = false
    //     }
    // }
    if (Bigger >= 0) {
        if (Value != '' && Value != ' ' && Value != null && Value != undefined && IsBlank(Value) != true && Value != false) {
            if (ValueLength < Less && ValueLength > Bigger) {
                State = true
            } else {
                State = false
            }
        } else {
            State = false
        }
    } else {
        if (ValueLength < Less) {
            State = true
        } else {
            State = false
        }
    }

    if (Type == 'Password') {
        Input.value = Value.replace(/\s+/g, '')
        Value = Input.value
        if (ValidationAllCharIsEnglish(null, Value, 'Value') == false) {
            // Input.value = String(Input.value).slice(0,-1)
            Input.setAttribute('Valid', 'false')
            State = false
        }
    }

    if (SetIn != 'None') {
        if (SetIn == 'Container') {
            let Container = Input.parentNode
            if (State == true) {
                Container.classList.add('InputValid')
                Container.classList.remove('InputInValid')
            } else {
                Container.classList.remove('InputValid')
                Container.classList.add('InputInValid')
            }
        }
        if (SetIn == 'Icon') {
            let Icon = Input.parentNode.querySelector('i')
            if (State == true) {
                Icon.classList.remove('fa-times-circle')
                Icon.classList.add('fa-check-circle')
            } else {
                Icon.classList.add('fa-times-circle')
                Icon.classList.remove('fa-check-circle')
            }
        }
        if (SetIn == 'Input') {
            if (State == true) {
                Input.classList.add('InputValid')
                Input.classList.remove('InputInValid')
            } else {
                Input.classList.remove('InputValid')
                Input.classList.add('InputInValid')
            }
        }
    }

    if (NoSpace == true && Type == 'Text') {
        Input.value = Value.replace(/\s+/g, '')
    }

    Input.setAttribute('Valid', State)
    return State
}


//////////////////////////////////                  Scroll          ///////////////////////////////////////////////

let HeightWindowBaseTemplate = window.innerHeight
window.onscroll = function () {
    try {
        if (window.scrollY > HeightWindowBaseTemplate) {
            document.getElementById('ButtonGoToTopPage').classList.add('ButtonGoToTopIsShow')
        } else {
            document.getElementById('ButtonGoToTopPage').classList.remove('ButtonGoToTopIsShow')
        }
    } catch (e) {
    }
}

//////////////////////////////////                Functionality Cookie         ///////////////////////////////////////////////

function SetCookieFunctionality_ShowNotification(Text, Type, Timer = 5000, LevelOfNecessity = 2) {
    document.cookie = `Functionality_N=${ConvertCharPersianToEnglishDecode(Text)}~${Type}~${Timer}~${LevelOfNecessity};path=/`
}



function GetCookieFunctionality_ShowNotification() {
    setTimeout(function () {
        let AllCookies = document.cookie.split(';')
        let Cookie_Key
        let Cookie_Val
        for (let Co of AllCookies) {
            let Key = Co.split('=')[0]
            let Value = Co.split('=')[1]
            if (Key == 'Functionality_N' || Key == ' Functionality_N' || Key == ' Functionality_N ') {
                Cookie_Key = Key
                Cookie_Val = Value
            }
        }
        let Text
        let Type
        let Timer
        let LevelOfNecessity
        try {
            Text = Cookie_Val.split('~')[0] || 'نا مشخص'
            Text = Text.replace('"', '')
            Text = Text.replace("'", '')
            Type = Cookie_Val.split('~')[1] || 'Warning'
            Timer = Cookie_Val.split('~')[2] || 8000
            LevelOfNecessity = Cookie_Val.split('~')[3] || 2
        } catch (e) {
        }
        if (Cookie_Key == 'Functionality_N' || Cookie_Key == ' Functionality_N' || Cookie_Key == ' Functionality_N ') {
            let TextResult = ConvertCharEnglishToPersianDecode(Text)
            ShowNotificationMessage(TextResult, Type, Timer, LevelOfNecessity)
        }
        document.cookie = `${Cookie_Key}=Closed; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
    })
}

/////////////  Convert English Char & Persian Decode //////////////////////////

function ConvertCharEnglishToPersianDecode(Text) {
    let Dict_Char_Persian_English = {
        'ا': 'a1',
        'آ': 'a2',
        'ب': 'b1',
        'پ': 'p1',
        'ت': 't1',
        'ث': 'c1',
        'ج': 'j1',
        'چ': 'ch',
        'ح': 'h1',
        'خ': 'kh',
        'د': 'd1',
        'ذ': 'z1',
        'ر': 'r1',
        'ز': 'z2',
        'ژ': 'zh',
        'س': 'c2',
        'ش': 'sh',
        'ص': 'c3',
        'ض': 'z3',
        'ط': 't2',
        'ظ': 'z4',
        'ع': 'a3',
        'غ': 'g_',
        'ف': 'f1',
        'ق': 'g5',
        'ک': 'k1',
        'گ': 'k2',
        'ل': 'l1',
        'م': 'm1',
        'ن': 'n1',
        'و': 'v1',
        'ه': 'h2',
        'ی': 'e2',
        ' ': '11',
        '': '22',
    }
    let CharEn = Object.keys(Dict_Char_Persian_English)
    let TextResult = ''
    for (let Index = 0; Index < Text.length; Index++) {
        if (Index % 2 == 0) {
            TextResult += GetKeyByValue(Dict_Char_Persian_English, Text[Index] + Text[Index + 1])
        }
    }
    return TextResult
}


function ConvertCharPersianToEnglishDecode(Text) {
    let Res = ''
    for (let i of Text){
        try {
            Res += Dict_Char_Persian_English[i]
        }catch (e) {
        }
    }
    return Res
}




/////////////////////////////  Get Key By Val  //////////////////////////


function GetKeyByValue(Obj, Val) {
    return Object.keys(Obj).find(K => Obj[K] === Val);
}


////////////////////////////////////// Remove In  List //////////////////////////////////////////////////

function RemoveInList(List, Index) {
    let Counter = 0
    Index = parseInt(Index)
    let NewList = []
    for (let i of List) {
        if (Counter != Index) {
            NewList.push(i)
        }
        Counter++
    }
    return NewList
}

//////////////////////////////////   List Is None ///////////////////////////////////////////////////////////

function ListIsNone(List) {
    let State = false
    if (List[0] == undefined) {
        State = true
    }
    return State
}

////////////////////////////////////   Value in  List  ///////////////////////////////////////////////////

function ValueInList(List, Value) {
    let State = false
    List.filter(function (e) {
        if (e == Value) {
            State = true
        }
    })
    return State
}

////////////////////////////////////  Replace With Index  ///////////////////////////////////////////////
String.prototype.ReplaceWithIndex = function (StartIndex, EndIndex, NewStr) {
    return this.substring(0, StartIndex) + NewStr + this.substring(EndIndex);
};


/////////// Get Value in Attribute ToHref in Element in Redirect To Value Geted  ///////////////////////

function GoToUrlElement(This) {
    let Href = This.getAttribute('ToHref')
    GoToUrl(Href, 'Blank')
}

/////////////////////////////    Loading Notification  /////////////////////////////////////////////////
function RemoveLoading() {
    let ElementLoading = document.getElementsByClassName('LoadingNotification')[0]
    ElementLoading.remove()
    document.body.classList.remove('DisabledAllElementsExceptLoadingNotification')
}

//////////////////////////////////        Cookie          ////////////////////////////////////////

function GetCookieByName(Name) {
    let Res = null
    let Cookie = document.cookie
    for (let i of Cookie.split(';')) {
        let S1 = i.split('=')[0]
        let S2 = i.split('=')[1]
        if (S1 == Name || S1 == ` ${Name}` | S1 == `${Name} `) {
            Res = S2
        }
    }
    return Res
}

function SetCookie(Name, Value, ExpireDay = 30, Path = '/') {
    let T = new Date()
    T.setTime(T.getTime() + (ExpireDay * 24 * 60 * 60 * 1000))
    T = T.toUTCString()
    if (ExpireDay == 'Session') {
        T = ''
    }
    document.cookie = `${Name}=${Value};expires=${T};path=${Path}`
}

////////////////////////////  Split Number   /////////////////////////////////////////////////////////

function SplitPrice(Element = null) {
    let SplitPriceNumber
    if (Element == null) {
        SplitPriceNumber = document.getElementsByClassName('SplitNumber')
    } else {
        SplitPriceNumber = new Array(Element)
    }
    for (let P of SplitPriceNumber) {
        let ListChar = []
        let Price = String(P.getAttribute('Number'))
        let Result = Price
        let LengthNumber = Price.length

        if (LengthNumber > 3) {
            Result = ''
            for (let o of Price) {
                ListChar.push(o)
            }
            ListChar.reverse()
            let CounterList = 0
            for (let i of ListChar) {
                CounterList++
                if (CounterList % 4 == 0) {
                    ListChar.splice(CounterList - 1, 0, ' , ')
                }
            }
        }
        for (let C of ListChar.reverse()) {
            Result += C
        }
        P.innerText = Result
    }
}

//////////////////////////////      Title  Element       //////////////////////////////////////////////
let AllTitle_ = document.querySelectorAll('[Title_]')
for (let Element of AllTitle_) {
    let TextTitle = Element.getAttribute('Title_')

    function CreateTitleContainer() {
        let P = document.createElement('p')
        P.className = 'Title_Style_Customize'
        P.innerHTML = TextTitle
        Element.insertBefore(P, Element.firstChild)
    }

    CreateTitleContainer()
}

////////////////////////////////      Create Container Blur   /////////////////////////////////////////////
function CreateContainerBlur(Top = 'Default', Class = null, Style = null, Size = 'Medium') {
    DeleteContainerBlur()
    LockAllElements()
    let Container = document.createElement('div')
    let Container2 = document.createElement('div')
    // let IconClose = document.createElement('i')
    // IconClose.onclick = DeleteContainerBlur
    // IconClose.setAttribute('id', 'ContainerBlurIconClose')
    // IconClose.className = 'fa fa-times ContainerBlurIconClose'
    Container.setAttribute('ContainerBlur', '')
    Container.setAttribute('Size', Size)
    Container.className = 'ContainerBlur'
    Container2.className = 'ContainerContentBlur'
    Class != null ? Container.classList.add(Class) : ''
    Style != null ? Container.style = Style : ''
    Top != 'Default' ? Container.style.top = Top + '%' : Container.style.top = '1%'
    // Container2.appendChild(IconClose)
    Container.appendChild(Container2)
    document.body.insertBefore(Container, document.body.firstElementChild)
    document.body.classList.add('BlurAllElementsExceptContainerBlur')
    ScrollOnElement(null, Container)
    return Container2
}

function DeleteContainerBlur() {
    try {
        document.querySelector('[ContainerBlur]').remove()
    } catch (e) {
    }
    UnlockAllElements()
    document.body.classList.remove('BlurAllElementsExceptContainerBlur')
}


////////////////     Click Out Side Container Blur And Other Container With Blur    /////////////////

function ClickOutSideContainer(Container, FuncWhenOutSideClick, State = 'Inside') {
    document.addEventListener('click', ClickOutSideCnt = function (event) {
        let IsClickInContainer = Container.contains(event.target);
        if (!IsClickInContainer) {
            if (State == 'OutSide') {
                FuncWhenOutSideClick()
                State = 'Inside'
                document.removeEventListener('click', ClickOutSideCnt)
            }
            State = 'OutSide'
        }
    });
}

////////////////     Click Out Side Container or Not    /////////////////


function ReturnClickInContainer(Container) {
    let StateResult = false
    document.addEventListener('click', ClickInSideOrNot = function (event) {
        let StateClick = Container.contains(event.target)
        if (StateClick) {
            StateResult = true
        }
    })
    document.removeEventListener('click', ClickInSideOrNot)
    return StateResult
}

////////////////     Settings Container Menu    /////////////////


function OpenMenuContainer(Menu) {
    Menu.classList.remove('MenuIsClose')
    Menu.classList.add('MenuIsOpen')
}

function CloseMenuContainer(Menu) {
    Menu.classList.remove('MenuIsOpen')
    Menu.classList.add('MenuIsClose')
}


//////////////////////////////////       Trun Chate Letters   ////////////////////////////////////////////
function TrunCateLetter(Text, ToNumber) {
    Text = String(Text)
    let LenText = Text.length
    let Y = Text.substr(0, ToNumber)
    if (parseInt(LenText) > parseInt(ToNumber)) {
        Y += ' . . .'
    }
    return Y
}

//////////////////////////////////      Full Screen Element   ////////////////////////////////////////////
function OpenFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

//////////////////////////////////       Sign Out Account   ////////////////////////////////////////////
function SignOutAccount(Path = '/') {
    CreateMessage_Alert('ایا از خروج از حساب کاربری خود مطمعن هستید ؟', function () {
        SetCookie('QlYSqVS_', 'None*_', '0', Path)
        SetCookie('YPtIeRC_', 'None*_', '0', Path)
        location.reload()
    }, Path)
}

//////////////////////////////////       Menu      ////////////////////////////////////////////

function CreateMenu(Content = '', Style = '', Class = '', ID = '') {
    let Container = document.createElement('div')
    Container.className = `_ContainerMenu ${Class}`
    Container.style = Style
    Container.id = ID
    let IconCloseMenu = `<i class="far fa-times IconCloseMenu" IconCloseMenu></i>`
    let Br = `<br>`
    Container.innerHTML = IconCloseMenu
    Container.innerHTML += Br
    Container.innerHTML += Br
    Container.innerHTML += Content
    Container.setAttribute('ContainerMenu', '')
    document.body.appendChild(Container)
    EffectOnBodyMenuIsOpen()
    return Container
}

function EffectOnBodyMenuIsOpen() {
    document.body.classList.add('EffectOnBodyMenuIsOpen')
}


//////////////////////////////////      Menu Touch   ////////////////////////////////////////////


function SetTouchPadOnElement(Element, Type, arguments) {
    if (Type == 'Width') {
        let Direction = arguments.Direction || 'Rtl'
        let Max = arguments.Max || 'WidthWindow'
        let Min = arguments.Min || 0
        let OnTouchEndF = arguments.OnTouchEnd || function () {
        }
        let OnTouchStartF = arguments.OnTouchStart || function () {
        }
        Element.classList.add('MenuIsClose')
        Element.ontouchstart = function (e) {
            if (Element.getAttribute('StateOnTouchStart') == 'true') {
                OnTouchStartF(e)
                Element.setAttribute('StateOnTouchStart', 'false')
                Element.classList.remove('MenuIsOpen')
                Element.classList.remove('MenuIsClose')
            }
        }
        Element.ontouchmove = function (e) {
            if (Element == e.target) {
                SetTouchIncreaseWidthElement(Element, e, Direction, Max, Min)
                Element.setAttribute('StateOnTouchStart', 'true')
                Element.style.transition = 'all 0s'
            }
        }
        Element.ontouchend = function (e) {
            OnTouchEndF(e)
            let Element = e.currentTarget
            let ElementInfo = Element.getBoundingClientRect()
            Element.classList.remove('MenuIsOpen')
            Element.classList.remove('MenuIsClose')
            let MaxWidthOpen
            let MaxPX
            let MaxPercentage
            MaxPX = parseInt(Max.split('px')[0])
            MaxWidthOpen = MaxPX
            if (!Number.isInteger(MaxWidthOpen)) {
                MaxPercentage = Number.isInteger(Max.split('%')[0])
                MaxWidthOpen = (Element.parentNode.getBoundingClientRect().width * MaxPercentage) / 100
            }
            if (ElementInfo.width > (MaxWidthOpen / 2 - 20)) {
                OpenMenuHamburger(Element)
            } else {
                CloseMenuHamburger(Element)
            }
            Element.removeAttribute('style')
        }
    } else if (Type == 'Move') {
        Element.ontouchmove = function (e) {
            if (Element == e.target) {
                SetTouchMoveElement(e)
            }
        }
    } else if (Type == 'Both') {
        let Direction = arguments.Direction || 'Rtl'
        let Max = arguments.Max || 'WidthWindow'
        let Min = arguments.Min || 0
        Element.ontouchmove = function (e) {
            SetTouchIncreaseWidthElement(Element, e, Direction, Max, Min)
            SetTouchMoveElement(e)
            Element.style.transition = 'all 0s'
        }
    }
    return Element
}

function CollectionHas(A, B) {
    for (let i = 0, len = A.length; i < len; i++) {
        if (A[i] == B) return true;
    }
    return false;
}

function FindElementParentBySelector(Element, Selector) {
    let All = document.querySelectorAll(Selector);
    let Cur = Element.parentNode;
    while (Cur && !CollectionHas(All, Cur)) {
        Cur = Cur.parentNode;
    }
    return Cur;
}


function SetTouchIncreaseWidthElement(ElementMenu, e, Direction, Max = 'WidthWindow', Min = 0) {
    let UnitWidthX = e.targetTouches[0].clientX
    let WidthWindow = window.outerWidth
    if (Direction == 'Ltr') {
        UnitWidthX = WidthWindow - UnitWidthX
    }
    let Element = e.target
    if (Max != 'WidthWindow') {
        let MaxPX = Max.split('px')[0]
        WidthWindow = Number(MaxPX);
        if (!Number.isInteger(WidthWindow)) {
            let MaxPercentage = Max.split('%')[0]
            WidthWindow = (Element.parentNode.getBoundingClientRect().width * MaxPercentage) / 100
            if (Number.isInteger(WidthWindow) == false) {
                throw ('ValueError in ValueType SetTouch Functionality')
            }
        }
    }

    if (UnitWidthX <= WidthWindow && UnitWidthX >= Min) {
        Element.style.width = UnitWidthX + 'px'
        Element.setAttribute('Width', `${UnitWidthX}px`)
    }

}


function SetTouchMoveElement(e) {
    let UnitMoveX = e.targetTouches[0].clientX
    let UnitMoveY = e.targetTouches[0].clientY
    SetElementOnScreenX(e.target, UnitMoveX)
    SetElementOnScreenY(e.target, UnitMoveY)
}


function SetElementOnScreenX(Element, X) {
    let WidthWindow = parseInt(window.outerWidth)
    let InformationElement = Element.getBoundingClientRect()
    let Width = InformationElement.width
    if (X <= WidthWindow && X >= 0) {
        Element.style.left = `${X}px`
        Element.setAttribute('Left', `${X}px`)
    }
}

function SetElementOnScreenY(Element, Y) {
    let HeightWindow = parseInt(window.outerHeight)
    let InformationElement = Element.getBoundingClientRect()
    let Height = InformationElement.height
    if (Y <= HeightWindow && Y >= 0) {
        Element.style.top = `${Y}px`
        Element.setAttribute('Top', `${Y}px`)
    }
}


let VarStateEventClickDoc
let StateSetClickOutSideMenu = true

function SetClickOutSideMenu(Element, BtnHamburger = null) {
    if (StateSetClickOutSideMenu) {
        //  RemoveElementWhenPasteToMenu()
        for (let i of Element.children) {
            i.addEventListener('click', function (e) {
                if (e.target.getAttribute('IconCloseMenu') == null) {
                    OpenMenuContainer(Element)
                }
            })
        }
        document.addEventListener('click', VarStateEventClickDoc = function (event) {
            let StateClickMenu, StateClickIconOpen
            if (BtnHamburger == null) {
                let IconOpenMenu = document.getElementById('IconHamburgerMenu')
                StateClickMenu = Element.contains(event.target)
                StateClickIconOpen = IconOpenMenu.contains(event.target)
            } else {
                StateClickMenu = Element.contains(event.target)
                StateClickIconOpen = BtnHamburger.contains(event.target)
            }
            if (!StateClickMenu && !StateClickIconOpen) {
                CloseMenuHamburger(Element)
            }
        })
    }
    StateSetClickOutSideMenu = false
}


// let ElementMenuWithTouch = SetTouchPadOnElement(CreateMenu(ElementsInMenu), 'Width', {
//         'Direction': 'Ltr', 'Max': '210px', 'Min': '0', 'OnTouchEnd': function (e) {
//             let Element = e.target
//             let ElementInfo = Element.getBoundingClientRect()
//             Element.classList.remove('MenuIsOpen')
//             Element.classList.remove('MenuIsClose')
//             if (ElementInfo.width > 125) {
//                 OpenMenuHamburger()
//             } else {
//                 CloseMenuHamburger()
//             }
//             Element.removeAttribute('style')
//         }, 'OnTouchStart': function (e) {
//         }
//     }
// ) ------------------------ For Example --------------------------


function OpenMenuHamburger(ElementMenuWithTouch, BtnHamburger = null) {
    SetClickOutSideMenu(ElementMenuWithTouch, BtnHamburger)
    OpenMenuContainer(ElementMenuWithTouch)
}

function OpenMenuHamburgerID(ID) {
    let Element = document.getElementById(ID)
    OpenMenuHamburger(Element)
}


function CloseMenuHamburger(ElementMenuWithTouch) {
    CloseMenuContainer(ElementMenuWithTouch)
}

function CloseMenuHamburgerID(ID) {
    let Element = document.getElementById(ID)
    CloseMenuContainer(Element)
}


//////////////////////////////////      Get And Paste Element To Element   ////////////////////////////////////////////

function PasteElementToElement(Element, ToElement, Attr = '') {
    if (Attr != '' && Attr != ' ') {
        for (let Key in Attr) {
            Element.setAttribute(Key, Attr[Key]);
        }
    }
    ToElement.appendChild(Element)
}

//---------------------                          ClickFunc                           -----------------
// Run Function Passed In Attribute Elements

let AllClickFunc = document.querySelectorAll('[ClickFunc]')
for (let i of AllClickFunc) {
    i.onclick = function (e) {
        try {
            let Element = e.currentTarget
            let ValAttr = Element.getAttribute('ClickFunc')
            let NameFunc = ValAttr.split('(')[0]
            let ValFunc = ValAttr.split('(')[1]
            ValFunc = ValFunc.replace(')', '') || []
            if (typeof ValFunc == "string") {
                ValFunc = new Array(ValFunc)
            }
            let FuncRuned = window[NameFunc].apply(window, ValFunc)

        } catch (e) {
            throw (` Attribute "ClickFunc" In One of The Elements or Most Is Wrong`)
        }
    }
}


/*let FuncSetActiveContainer = ActiveContainer
let AttrSearchContainer = 'ContainerItemMenu'
let ValAttrContainerDefault = 'Info'
let UrlContainer = window.location.href
let ValueForItemMenu = UrlContainer.split('?')[1]
if (ValueForItemMenu != undefined && ValueForItemMenu != '' && ValueForItemMenu != ' ') {
    let ItemsInMenuForURL = document.querySelector(`[${AttrSearchContainer}=${ValueForItemMenu}]`)
    if (ValueForItemMenu == 'Home') {
        GoToUrl('/')
    }
    if (ItemsInMenuForURL != null) {
        FuncSetActiveContainer(ItemsInMenuForURL)
    }
} else {
    ItemsInMenuForURL = document.querySelector(`[${AttrSearchContainer}=${ValAttrContainerDefault}]`)
    FuncSetActiveContainer(ItemsInMenuForURL)
}*/


let AllCheckInputVal = document.querySelectorAll('[CheckInputVal]')
for (let i of AllCheckInputVal) {
    let Bigger = i.getAttribute('Bigger')
    let Less = i.getAttribute('Less')
    let TypeVal = i.getAttribute('TypeVal') || 'Text'
    let SetIn = i.getAttribute('SetIn') || 'Input'
    if (TypeVal == 'File') {
        ValidationFile(i, SetIn)
    } else {
        CheckInputValidations(i, Bigger, Less, SetIn, TypeVal)
    }
}


function ValidationEmail(Email) {
    const Re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return Re.test(String(Email).toLowerCase());
}

function ValidationIsNumber(Text) {
    Text.match(/\D/g)
    let State = false
    if (Text.match(/\D/g) == null && Number.isInteger(parseInt(Text))) {
        State = true
    } else {
        State = false
    }
    return State
}


function ValidationFile(Input, SetIn = 'Input') {
    let State = false
    let Value = Input.value
    let StateInputFile = Input.getAttribute('State')
    if (StateInputFile == 'MostGet') {
        if (Value != '' && Value != ' ' && !IsBlank(Value)) {
            State = true
        } else {
            State = false
        }
    }


    if (State == true || StateInputFile != 'MostGet') {
        if (SetIn == 'Input') {
            Input.classList.add('InputValid')
        } else if (SetIn == 'Icon') {
            let Icon = Input.parentNode.querySelector('i')
            Icon.className = 'far fa-check-circle'
        } else if (SetIn == 'Container') {
            Input.parentNode.classList.add('InputValid')
        }
        State = true
    } else {
        if (SetIn == 'Input') {
            Input.classList.remove('InputValid')
        } else if (SetIn == 'Icon') {
            let Icon = Input.parentNode.querySelector('i')
            Icon.className = 'far fa-times-circle'
        } else if (SetIn == 'Container') {
            Input.parentNode.classList.remove('InputValid')
        }
        State = false
    }
    Input.setAttribute('Valid', State)
    return State
}

function ValidationAlphabet(e) {
    let Code = ('charCode' in e) ? e.charCode : e.keyCode;
    let State = false
    if (!(Code == 32) && // space
        !(Code > 47 && Code < 58) &&
        !(Code > 64 && Code < 91) &&
        !(Code > 96 && Code < 123)) {
        State = false
        e.preventDefault();
    } else {
        State = true
    }
    return State
}

function ValidationInput(Element, Input, Bigger, Less) {

    let Value = Input.value
    let IconState = Element.querySelector('i')
    if (Value != '' && Value != ' ' && Value != null && Value.trim() != '' && CheckInputValidations(Input, parseInt(Bigger), parseInt(Less), 'None')) {
        IconState.className = 'fal fa-check-circle'
        Input.setAttribute('Valid', 'true')
    } else {
        IconState.className = 'fal fa-times-circle'
        Input.setAttribute('Valid', 'false')
    }

}

function ImageExists(ImageUrl) {
    let Ht = new XMLHttpRequest();
    Ht.open('HEAD', ImageUrl, false);
    Ht.send();
    return Ht.status != 404 ? true : false
}

function ValidationOnlyAlephbaAndNumber(e) {
    let State = false
    var code = ('charCode' in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && // space
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        State = true
        e.preventDefault();
    } else {
        State = false
    }
    return State
}


function ValidationAllCharIsEnglish(Input, Val = null, TypeCheck = 'Input') {
    let State = false
    //let EnglishRegex = /^[A-Za-z ]+$/;
    let EnglishRegex = new RegExp("^[a-zA-Z0-9 ]+$")
    if (TypeCheck == 'Input') {
        if (EnglishRegex.test(Input.value)) {
            State = true
            Input.setAttribute('Valid', 'true')
            Input.classList.add('InputValid')
        } else {
            State = false
            Input.setAttribute('Valid', 'false')
            Input.classList.remove('InputValid')
        }
    } else {
        if (EnglishRegex.test(Val)) {
            State = true
        } else {
            State = false
        }
    }
    return State
}


function ValidationAllCharIsPersian(Val) {
    let _ = /^[\u0600-\u06FF\s]+$/;
    let State = false
    if (!_.test(Val)) {
        State = false
    } else {
        State = true
    }
    return State
}

// ----------------------------------   Animation Scroll   ---------------------------
let AllElementsWithAnimation = document.querySelectorAll('[AnimationScroll]')
let AllElementsWithAnimation_2 = document.querySelectorAll('[AnimationScroll_2]')
let ScrollOnElementVar = (entries, Observer) => {
    entries.forEach(Entry => {
        let ClassAnimation = Entry.target.getAttribute('AnimationScroll')
        let ClassAnimation_2 = Entry.target.getAttribute('AnimationScroll_2')
        if (Entry.isIntersecting) {
            Entry.target.classList.add(ClassAnimation)
            if (ClassAnimation_2 != null) {
                Entry.target.classList.add(ClassAnimation_2)
            }
        }
        // You Can UnComment and Whene Scroll Set Animation
        // else {
        //     Entry.target.classList.remove(ClassAnimation)
        //     if (ClassAnimation_2 != null) {
        //         Entry.target.classList.remove(ClassAnimation_2)
        //     }
        // }
    })
}


let Observer = new IntersectionObserver(ScrollOnElementVar, {
    threshold: [0.5]
});
AllElementsWithAnimation.forEach(Element => {
    if (Element) {
        Observer.observe(Element)
    }
})

// ------------------------------  Form & Item Form  -------------------------------

function EffectOnItemFormInput(Element) {
    Element.classList.add('ItemFormInputFocus')
}

function ClearEffectOnItemFormInput(Element) {
    Element.classList.remove('ItemFormInputFocus')
}

let AllInputFormBaseJS = document.querySelectorAll('[InputForm]')
for (let I of AllInputFormBaseJS) {
    I.addEventListener('focus', function (e) {
        EffectOnItemFormInput(e.currentTarget.parentNode)
    })
    I.addEventListener('focusout', function (e) {
        ClearEffectOnItemFormInput(e.currentTarget.parentNode)
    })
}


function SignOutAccountMenu() {
    setTimeout(function () {
        CloseMenuContainer(document.getElementById('ContainerMenuHamburger'))
    })
    SignOutAccount()
}


let AllInputForm = document.querySelectorAll('[InputForm]')
for (let Input of AllInputForm) {
    let TypeInput = Input.type
    if (TypeInput != 'file') {
        Input.addEventListener('input', function (e) {
            let Input = e.currentTarget
            let Bigger = Input.getAttribute('Bigger')
            let Less = Input.getAttribute('Less')
            let TypeVal = Input.getAttribute('TypeVal') || 'Text'
            let SetIn = Input.getAttribute('SetIn') || 'Input'
            CheckInputValidations(Input, Bigger, Less, SetIn, TypeVal)
        })
    } else {
        Input.addEventListener('change', function (e) {
            let Input = e.currentTarget
            let SetIn = Input.getAttribute('SetIn') || 'Input'
            ValidationFile(Input, SetIn)
            let IdImageTag = Input.getAttribute('IdImageTag')
            let ImageTag = document.querySelector(`#${IdImageTag}`)
            let State = Input.getAttribute('Valid') || 'false'
            if (ImageTag != null) {
                Input.parentNode.querySelector('[name="StateImage"]').value = 'MostGet'
                Input.setAttribute('State', 'MostGet')
                if (State == 'true') {
                    const [Image] = Input.files
                    if (Image) {
                        ImageTag.src = URL.createObjectURL(Image)
                    }
                } else {
                    ImageTag.src = '__None__'
                }
            }
        })
    }
}

// ---------------------  Timer ----------------------------------

let TagsWithTimer = document.querySelectorAll('[TimerCounterDown]')
for (let T of TagsWithTimer) {
    let ToDate = T.getAttribute('ToDateTimer')
    TimerCountDown(T, ToDate)
}

function TimerCountDown(Element, ToDate) {
    let CountDownDate = new Date(ToDate);
    let x = setInterval(function () {
        let Now = new Date().getTime();
        let Distance = CountDownDate - Now;
        let Days = Math.floor(Distance / (1000 * 60 * 60 * 24));
        let Hours = Math.floor((Distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let Minutes = Math.floor((Distance % (1000 * 60 * 60)) / (1000 * 60));
        let Seconds = Math.floor((Distance % (1000 * 60)) / 1000);

        let Res = `${Days}:${Hours}:${Minutes}:${Seconds}`;
        if (Days == 0) {
            Res = `${Hours}:${Minutes}:${Seconds}`
        }
        Element.innerHTML = Res
        if (Distance < 0) {
            clearInterval(x);
            Element.innerHTML = "EXPIRED";
        }
    }, 1000);
}


function TimerCountDownObject(ToDate) {
    let CountDownDate = new Date(ToDate);
    let Now = new Date().getTime();
    let Distance = CountDownDate - Now;
    let Days = Math.floor(Distance / (1000 * 60 * 60 * 24));
    let Hours = Math.floor((Distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let Minutes = Math.floor((Distance % (1000 * 60 * 60)) / (1000 * 60));
    let Seconds = Math.floor((Distance % (1000 * 60)) / 1000);
    return {
        'Days': Days,
        'Hours': Hours,
        'Minutes': Minutes,
        'Seconds': Seconds
    }
}

//-------------------------- Lock and Unlock All Elements ------------------------

function LockAllElements() {
    $('body *').prop('disabled', true)
}

function UnlockAllElements() {
    $('body *').prop('disabled', false)
    $('input[type=checkbox]').prop('disabled', true)
    $('#ContainerForm input[type=radio]').prop('disabled', true)
    $('#ContainerForm input[type=file]').prop('disabled', true)
}


// ------------------------  Dark Mode  -----------------------------------


function ControllThemeAndBtn(Theme, SrcStyleDark, FuncDark, Funclinght) {
    if (Theme == 'Dark') {
        let StyleDark = document.createElement('link')
        StyleDark.rel = 'stylesheet'
        StyleDark.href = SrcStyleDark
        StyleDark.id = '_ThemeStyleDark'
        document.head.append(StyleDark)

        // Header Dark
        let StyleDarkHeader = document.createElement('link')
        StyleDarkHeader.rel = 'stylesheet'
        StyleDarkHeader.href = '/Assets/Css/Base/Header/index-dark.css' // Style Dark Header
        StyleDarkHeader.id = '_ThemeStyleDarkHeader'
        document.head.append(StyleDarkHeader)

        // Footer Dark
        let StyleDarkFooter = document.createElement('link')
        StyleDarkFooter.rel = 'stylesheet'
        StyleDarkFooter.href = '/Assets/Css/Base/Footer/index-dark.css' // Style Dark Footer
        StyleDarkFooter.id = '_ThemeStyleDarkFooter'
        document.head.append(StyleDarkFooter)


        BtnChangeTheme.setAttribute('ThemeColorMostActive', 'Light')
        BtnChangeTheme.className = 'fa fa-sun'
        FuncDark()
    } else {
        try {
            document.getElementById('_ThemeStyleDark').remove()
            document.getElementById('_ThemeStyleDarkHeader').remove()
            document.getElementById('_ThemeStyleDarkFooter').remove()
        } catch (e) {
        }
        BtnChangeTheme.setAttribute('ThemeColorMostActive', 'Dark')
        BtnChangeTheme.className = 'fa fa-moon'
        Funclinght()
    }
}


function Initial_DarkMode_Controll(Btn, Dict, FuncDark = undefined, Funclinght = undefined) {
    if (FuncDark == undefined) {
        FuncDark = function () {
        }
    }
    if (Funclinght == undefined) {
        Funclinght = function () {
        }
    }
    let SrcFile
    try {
        SrcFile = Dict['Src']
    } catch (e) {
        throw Error('Src Value Must not be Empty')
    }
    let Theme = GetCookieByName('ThemeColor') || 'Light'
    Btn.addEventListener('click', function () {
        Theme = Btn.getAttribute('ThemeColorMostActive') || 'Light'
        ControllThemeAndBtn(Theme, SrcFile, FuncDark, Funclinght)
        SetCookie('ThemeColor', Theme, 365)
    })
    ControllThemeAndBtn(Theme, SrcFile, FuncDark, Funclinght)
}

// ----------------   Random Shuffle List -----------------
function ShuffleList(List) {
    let CurentIndex = List.length, RandomIndex;
    while (CurentIndex != 0) {
        RandomIndex = Math.floor(Math.random() * CurentIndex);
        CurentIndex--;
        [List[CurentIndex], List[RandomIndex]] = [
            List[RandomIndex], List[CurentIndex]];
    }
    return List;
}

// ----------------   Random String --------------------

function CreateRandomSTR(Len) {
    let Results = '';
    let Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let CharsLen = Chars.length;
    for (let i = 0; i < Len; i++) {
        Results += Chars.charAt(Math.floor(Math.random() * CharsLen));
    }
    return Results;
}