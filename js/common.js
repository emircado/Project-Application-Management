var token = null;

var Utils =
{
    philRegexp : new RegExp('^[+| ]?(639|09|9)[0-9]{2,2}[0-9]{7,7}$'),
    emailRegexp : new RegExp('^([A-Za-z0-9\.\_\-]+)@([A-Za-z0-9\.\_\-]+).([A-Za-z]){2}?$'),
    
    //For on error Message
    onErrorMessage : 'There seems to have a problem.<br />Kindly reload the page and try again.',

    compareStrings : function(lString, rString)
    {
        if (typeof(lString) !== 'string' || typeof(rString) !== 'string')
            return false;
        if (lString===rString)
            return true;
        return false;
    },

    findCapitalLetter: function(string)
    {
        if (/[A-Z]/g.exec(string)!==null) return true;
        else return false;
    },

    
    onAjaxError : function()
    {
        var self = this;
        
        return self.onErrorMessage;
    },
    
    philRegTest : function(mobnum)
    {
        var self = this;
        
        return self.philRegexp.test(mobnum);
    },
    
    emailRegTest : function(email)
    {
        var self = this;
        
        return self.emailRegexp.test(email);
    },
    
    mobileReplace : function(mobnum)
    {
        var self = this;
        
        replacethis = mobnum;
        leadingplus = '';
        
        if (mobnum.substring(0, 1) == '+')
        {
            replacethis = mobnum.substring(1, mobnum.length).replace(/[^0-9]/g,'');
            leadingplus = '+';
        } else
            replacethis = mobnum.replace(/[^0-9]/g,'');
        
        return leadingplus + replacethis;
    },
    
    readHash : function()
    {
        hashString = document.location.hash;
        document.location.hash = '';
        
        if (hashString.length)
            hashString = JSON.decode(hashString.substring(1, hashString.length));
        else
            hashString = false;
        
        return hashString;
    },
    
    checkForm : function(fields, prefix)
    {
        var self = this;

        prefix = (prefix) ? prefix : '';
        
        errorArray = [];
        
        Object.each(fields, function(val, idx)
        {
            if (!$(prefix + idx).get('value').trim().length)
            {   
                if (idx != 'email')
                    errorArray[idx] = 'Cannot be empty.';
            }
            else
            {
                switch(idx)
                {
                    case 'msisdn':
                        if (!self.philRegTest($(prefix + idx).get('value').trim()))
                            errorArray[idx] = 'Invalid number.';
                        break;
                    case 'email':
                        if (!self.emailRegTest($(prefix + idx).get('value').trim()))
                            errorArray[idx] = 'Invalid email.';
                        break;
                }
            }
        });
        
        return errorArray;
    },

    scrollToTop : function()
    {
        var scroller = new Fx.Scroll(document.body);
        scroller.toTop();
    },

    hideFieldErrors : function(module, array)
    {
        var self = module;

        Object.each(array, function(val, idx)
        {
            $$('.field-' + idx).removeClass('field-error');
            $(self.requiredFields[idx]).setStyle('display', 'none');  
        });
    },

    showRequiredFieldErrors : function(module, array)
    {
        var self = module;

        $$('.' + self.fieldTextClass).removeClass('field-error');
        
        if (Object.getLength(array))
        {
            Object.each(array, function(val, idx)
            {
                $$('#' + idx).removeEvents();
                $$('#' + idx).addEvent('focus', function(e)
                {
                    e.preventDefault();
					
					$$('.field-' + idx).removeClass('field-error');
                    $(self.requiredFields[idx]).setStyle('display', 'none'); 
                });

                $$('.field-' + idx).addClass('field-error');

                $(self.requiredFields[idx]).set('html', val);
                $(self.requiredFields[idx]).setStyle('display', 'block');  
            });
            
            return false;
        } else
            return true;
    },

    showFieldError : function(module, array)
    {
        var self = module;
        var bool = true;

        console.log(module);

        if(!self.fieldTextClass)
        {
            console.log('Define this in your JS.');
            console.log('self.fieldTextClass = field-message');
            bool = false;
        }

        if(!array.elementId || !array.errorMessage)
        {
            console.log('Define this in your Controller');
            console.log('echo CJSON::encode(array(');
            console.log('\'hasError\'    => true,');
            console.log('\'dialogTitle\' => \'Error\',');
            console.log('\'errorMessage\'=> \'<Sample Error Message>\',');
            console.log('\'elementId\'   => \'sample-id\'');
            console.log(' ));');

            bool = false;
        }

        if(bool)
        {
            $$('.' + self.fieldTextClass).removeClass('field-error');
            $$('.field-' + array.elementId).addClass('field-error');
            $(self.requiredFields[array.elementId]).set('html', array.errorMessage);
            $(self.requiredFields[array.elementId]).setStyle('display', 'block');      
        }
        else
        {
            console.log('Define this in your html element');
            console.log('<input type="text" id="sample-id" /></span>');
            console.log('<span id="sample-id-error" class="field-sample-id-error error-message" style="display: none;"></span>');
        }
    }
};

var Inform =
{
    informMessageId : 'inform-dialog-message',
    informButtonId : 'inform-dialog-ok',
    informTitleId : 'inform-dialog-title',
    overlayId : 'inform-overlay',
    activeDialogId : 'inform-dialog',
    dialogId : 'inform-dialog-wrapper',
    
    show : function(title, message)
    {
        var self = this;
        
        $(self.informTitleId).set('html', title);
        $(self.informMessageId).set('html', message);
        
        $(self.overlayId).setStyle('display', 'block');
        $(self.dialogId).setStyle('display', 'block');
        $(self.activeDialogId).setStyle('display', 'block');
        
        self.informEvents();
        self.resizer();
    },
    
    close : function()
    {
        var self = this;
        
        $(self.overlayId).setStyle('display', 'none');
        $(self.dialogId).setStyle('display', 'none');
        $(self.activeDialogId).setStyle('display', 'none');
    },
    
    informEvents : function()
    {
        var self = this;
        
        $(self.informButtonId).removeEvents();
        $(self.informButtonId).addEvent('click', function(e)
        {
            e.preventDefault();
            
            self.close();
        });
    },
    
    resizer : function()
    {
        var self = Inform;
        
        var theBox = $(self.activeDialogId),
            winSize = window.getSize(),
            boxSize = theBox.getSize();
            
        theBox.setPosition({
            'x'  : ( ( winSize.x / 2 ) - ( boxSize.x / 2 ) ),
            'y' : ( ( winSize.y / 2 ) - ( boxSize.y / 2 ) )
        });
        
        window.removeEvent('resize', self.resizer);
        window.removeEvent('scroll', self.resizer);
        window.addEvent('resize', self.resizer);
        window.addEvent('scroll', self.resizer);
    }
};

var Confirm =
{
    confirmMessageId : 'confirm-dialog-message',
    confirmButtonId : 'confirm-dialog-ok',
    confirmDialogCancel : 'confirm-dialog-cancel',
    confirmTitleId : 'confirm-dialog-title',
    overlayId : 'confirm-overlay',
    activeDialogId : 'confirm-dialog',
    dialogId : 'confirm-dialog-wrapper',
    buttonContainerId : 'button-container',
    buttonX : 'confirm-dialog-close',
    customButton : {
        'Okay' : {
            'primary' : true,
            'callback' : function()
            {
                Confirm.close();
            }
        }
    },
    
    show : function(title, message, customEvent)
    {
        var self = this;
        
        //set default incase of reuse
        self.customButton = {
            'Okay' : {
                'primary' : true,
                'callback' : function()
                {
                    Confirm.close();
                }
            }
        };
        
        if (customEvent)
            self.customButton = customEvent;
        
        $(self.confirmTitleId).set('html', title + '<a href="#" id="confirm-dialog-close" class="close-dialog" title="Close"><span class="icon"></span></a>');
        $(self.confirmMessageId).set('html', message);
        
        $(self.overlayId).setStyle('display', 'block');
        $(self.dialogId).setStyle('display', 'block');
        $(self.activeDialogId).setStyle('display', 'block');
        
        self.confirmButtons();
        self.resizer();
    },
    
    close : function()
    {
        var self = this;
        
        $(self.overlayId).setStyle('display', 'none');
        $(self.dialogId).setStyle('display', 'none');
        $(self.activeDialogId).setStyle('display', 'none');
    },
    
    confirmButtons : function()
    {
        var self = this;
        
        $(self.buttonContainerId).set('html', '');
        
        Object.each(self.customButton, function(val, idx)
        {
            buttonName = idx.replace(/ /g, '');
            buttonId = 'confirm-dialog-' + buttonName.toLowerCase();
            button = buttonName.toLowerCase();
            
            if(button != 'cancel')
                buttonHTML = '<input class="action-button '+button+'" id="'+ buttonId +'" type="button" value="'+ idx +'">';
            else
                buttonHTML = '<a id="'+ buttonId +'" class="cancel" href="#">'+idx+'</a>';
            
            buttonElem = new Element('<div/>',
            {
                'class' : 'pseudo-field pseudo-button' + ((val['primary']) ? ' delete-button' : ''),
                'html' : buttonHTML
            });
            
            buttonElem.inject($(self.buttonContainerId));
            self.confirmEvents(buttonId, val['callback']);
        });
    },
    
    confirmEvents : function(buttonId, buttonCallback)
    {
        var self = this;
        
        $(buttonId).removeEvents();
        $(buttonId).addEvent('click', function(e)
        {
            e.preventDefault();
            
            buttonCallback();
        });
        
        $(self.buttonX).removeEvents();
        $(self.buttonX).addEvent('click', function(e)
        {
            e.preventDefault();
            
            Confirm.close();
        });
    },
    
    resizer : function()
    {
        var self = Confirm;
        
        var theBox = $(self.activeDialogId),
            winSize = window.getSize(),
            boxSize = theBox.getSize();
            
        theBox.setPosition({
            'x'  : ( ( winSize.x / 2 ) - ( boxSize.x / 2 ) ),
            'y' : ( ( winSize.y / 2 ) - ( boxSize.y / 2 ) )
        });
        
        window.removeEvent('resize', self.resizer);
        window.removeEvent('scroll', self.resizer);
        window.addEvent('resize', self.resizer);
        window.addEvent('scroll', self.resizer);
    }
};

var Header =
{
    navDropDownId : 'nav-dropdown',
    navFocusId : 'nav-focus',
    navOptionsId : 'nav-options',
    
    init : function()
    {
        this.addEvents();
    },
    
    addEvents : function()
    {
        var self = this;
        
        $$('#' + self.navFocusId).removeEvents();
        $$('#' + self.navFocusId).addEvents(
        {
            'click' : function()
            {
                $(this).setFocus();
                $(self.navOptionsId).addClass('active');
            },
            'blur' : function()
            {
                (function()
                {
                    $(Header.navOptionsId).removeClass('active');
                }).delay(200);
            }
        });
    }
};

window.addEvent('domready', function()
{
    Header.init();
    if (!token)
    {
        token = $$('#csrf').getFirst('div>input').get('value')[0];
        $$('#csrf').dispose();
    }
});

//adds setFocus functionality to mootools
Element.implement({
    setFocus: function(index) {
        this.setAttribute('tabIndex',index || 0);
        this.focus();
    }
});