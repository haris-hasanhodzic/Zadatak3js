function create_table(data){
    var div=document.createElement("div");
    div.setAttribute("class","table-div");
    document.getElementsByClassName("container")[0].appendChild(div);
    
    var table_div=document.getElementsByClassName("table-div")[0];
    
    table_div.innerHTML='<div>\
                    <h3>Users:</h3>\
                    <button onclick="edit(-1)" class="primary">Add</button>\
                </div>';
    
    var table=document.createElement("table");
    table.setAttribute("class","table table-hower");
    var tbody=document.createElement("tbody");
    var theader=document.createElement("thead");


    var trow=document.createElement("tr");
    var col=document.createElement("th")
    col.appendChild(document.createTextNode("Full name"));
    trow.appendChild(col);
    col=document.createElement("th")
    col.appendChild(document.createTextNode("Username"));
    trow.appendChild(col);
    col=document.createElement("th")
    col.appendChild(document.createTextNode("E-mail"));
    trow.appendChild(col);
    col=document.createElement("th")
    col.appendChild(document.createTextNode("Password"));
    trow.appendChild(col);
    col=document.createElement("th")
    col.appendChild(document.createTextNode("Delete"));
    trow.appendChild(col);

    theader.appendChild(trow);
    table.appendChild(theader);


    for (var i=0;i<data.length;i++)
        {
            var trow=document.createElement("tr");
            trow.setAttribute("onclick", "edit("+data[i]+")");
            for (var j=0;j<people[data[i]].length;j++){
                col=document.createElement("td");
                col.appendChild(document.createTextNode(people[data[i]][j]));
                trow.appendChild(col);
            }
            col=document.createElement("td");
            var button=document.createElement("button");
            button.innerHTML="Delete";
            button.setAttribute("onclick","delete_record(event, "+data[i]+")");
            button.setAttribute("class","btn-warning");
            col.appendChild(button);
            trow.appendChild(col);
            
            tbody.appendChild(trow);
        }

    table.appendChild(tbody);
    
    table_div.appendChild(table);
    create_page_select();
}
function create_search(){
    var container=document.getElementsByClassName("container")[0];
    var div=document.createElement("div");
    div.setAttribute("class","search");
    div.innerHTML='<div class="title"><label>Search</label></div>\
                <form action="" method="post">\
                    <input type="text" name="fullname" placeholder="Full name" value="" />\
                    <input type="text" name="username" placeholder="Username" value=""/>\
                    <input type="text" name="email" placeholder="Email" value=""/>\
                    <input type="text" name="password" placeholder="Password" value=""/>\
                    <button class="find " onclick="find(event)" >Find</button>\
                </form>\
            </div>';
    container.appendChild(div);
}
function create_page_select()
{
    var container=document.getElementsByClassName("table-div")[0];
    var div=document.createElement("div");
    div.setAttribute("class","pages");
    
    for(var i=1;i<=total_pages;i++)
    {
        var button=document.createElement("button");
        button.setAttribute("onclick","to_page("+i+")");
        if(i==page)
            button.setAttribute("class","active");
        button.innerHTML=i;
        div.appendChild(button);
    }
    container.appendChild(div);
        
}


function edit(id,fullnameErr, usernameErr, emailErr, passwordErr, fullname, username, email, password)
{
    var container=document.getElementsByClassName("container")[0];
    fullname=fullname||"";
    username=username||"";
    email=email||"";
    password=password||"";
    fullnameErr=fullnameErr||"";
    usernameErr=usernameErr||"";
    emailErr=emailErr||"";
    passwordErr=passwordErr||"";
    if (id>=0 && fullnameErr=="" && usernameErr=="" && emailErr=="" && passwordErr=="")
    {
        var person=people[id];
        fullname=person[0];
        username=person[1];
        email=person[2];
        password=person[3];
    }
    container.innerHTML='<div class="edit">\
                <div class="title"><h3>Edit user</h3></div>\
                <form action="sdf" method="post">\
                    <div class="group">\
                        <label>Full name:</label>\
                        <input type="text" name="fullname" placeholder="Full name" value="'+fullname+'"/>\
                        <span  class="error">'+ fullnameErr+'</span>\
                    </div>\
                    <div class="group">\
                        <label>Username:</label> \
                        <input type="text" name="username" placeholder="Username" value="'+username+'"/>\
                        *<span class="error">'+usernameErr+'</span>\
                    </div>\
                    <div class="group">\
                        <label>E-mail:</label>\
                        <input type="email" name="email" placeholder="Email" value="'+email+'"/>\
                        * <span class="error">'+emailErr+'</span>\
                    </div>\
                    <div class="group">\
                        <label>Password:</label>\
                        <input type="text" name="password" placeholder="Password" value="'+password+'"/>\
                        *<span class="error"> '+passwordErr+'</span>\
                    </div>\
                    <button class="btn-warning" onclick="toIndex(event)">Cancel</button>\
                    <button onclick="save(event, '+id+')" class="save" >Save</button>\
                </form>\
            </div>\
        </div>'
}

function delete_record(event, id)
{
    event.preventDefault();
    event.stopPropagation();
    if(confirm("Are you sure you want to delete?")){
        people.splice(id,1);
        localStorage.people=JSON.stringify(people);
        set_global(page, count-1);
        to_page(page);
    }
}
function validate(id,fullname, username, email, password){
    var fullnameErr, usernameErr, emailErr, passwordErr;
    console.log(id);
    if(fullname.match(/[^a-z ]/i))
        fullnameErr="Only letters and white space allowed";
    if(username.match(/[^a-z0-9_]/i))
        usernameErr="Only letters, uderscore and numbers allowed";
    if(!username.match(/[a-z0-9_]{3,}/i))
        usernameErr="Minimum 3 characters";
    if(!email.match(/[a-z.]{3,}@[a-z]{2,}.[a-z]{2,}/i))
        emailErr= "Invalid email format";
    if(!password.match(/.{6,}/i))
        passwordErr="Password is to short (MIN. 6 characters)";
    for(i=0;id<0 && i<people.length;i++)
    {
        if(username==people[i][1])
        {
            usernameErr="Username is already taken";
            break;
        }
    }
    var valid=false;
    if (!fullnameErr && !usernameErr && !emailErr && !passwordErr)
        valid=true;
    return [valid,fullnameErr, usernameErr, emailErr, passwordErr];
}
function save(event, id)
{
    event.preventDefault();
    event.stopPropagation();
    var form=document.getElementsByClassName("edit")[0].getElementsByTagName("form")[0];
    var input=form.getElementsByTagName("input");
    var fullname, username, password,email;
    fullname=input[0].value;
    username=input[1].value;
    email=input[2].value;
    password=input[3].value;
    
    var err=validate(id,fullname, username, email, password);
    if(err[0])
    {
        if(id>=0)
        {
            people[id][0]=fullname;
            people[id][1]=username;
            people[id][2]=email;
            people[id][3]=password;

        }
        else{
            var new_person=[input[0].value,input[1].value,input[2].value,input[3].value];
            people.push(new_person);
            set_global(page,count+1);
        }   
        localStorage.people=JSON.stringify(people);
        toIndex(event);
    }
    else{
        edit(id,err[1], err[2], err[3], err[4],fullname, username, email, password)
    }
}
function toIndex(e){
    e.preventDefault();
    e.stopPropagation();
    document.getElementsByClassName("container")[0].innerHTML="";
    create_table_page();
    create_search();
    set_find_data();
}
function to_page(id)
{
    var container=document.getElementsByClassName("container")[0];
    container.removeChild(container.getElementsByClassName("table-div")[0]);
    set_global(id,count);
    create_table_page();
}
function find_data(){
    var data=new Array();
    var fullname= localStorage.fullname ;
    var username= localStorage.username;
    var email= localStorage.email;
    var password= localStorage.password;
    var fullnamePatt,usernamePatt,emailPatt,passwordPatt;
    if (fullname)
        fullnamePatt = new RegExp(fullname+"+", "i");
    if (username)
        usernamePatt = new RegExp(username+"+", "i");
    if (email)
        emailPatt = new RegExp(email+"+", "i");
    if (password)
        passwordPatt = new RegExp(password+"+", "i");
    
    for(var i=0,j=0;people[i];i++)
    {
        if((!fullname || people[i][0].match(fullnamePatt)) && (!username || people[i][1].match(usernamePatt)) && (!email || people[i][2].match(emailPatt)) && (!password || people[i][3].match(passwordPatt)) )
        {
            data.push(i);
        }
    }
    set_global(page,data.length);
    return data.splice(offset,limit);
}
function set_page(page, count)
{
    if(page>1 && count<=(page-1)*limit)
    {
        return (Math.floor(count/limit))?Math.floor(count/limit):1;
    }
    return page;
}
function create_table_page()
{
    var people = find_data();
    create_table(people);
    
}
function find(event)
{
    event.preventDefault();
    event.stopPropagation();
    load_find_data();
    to_page(page);
}
function load_find_data(){
    var form=document.getElementsByClassName("search")[0].getElementsByTagName("form")[0];
    var input=form.getElementsByTagName("input");
    localStorage.fullname=input[0].value;
    localStorage.username=input[1].value;
    localStorage.email=input[2].value;
    localStorage.password=input[3].value;  
}
function set_find_data(){
    var form=document.getElementsByClassName("search")[0].getElementsByTagName("form")[0];
    var input=form.getElementsByTagName("input");
    input[0].value=localStorage.fullname;
    input[1].value=localStorage.username;
    input[2].value=localStorage.email;
    input[3].value=localStorage.password;  
}
function set_global(page_t, count_t){
    page=set_page(page_t, count_t);
    count=count_t;
    offset=(page-1)*limit;
    total_pages=(count%limit)?Math.floor(count/limit)+1:Math.floor(count/limit);
}
function set_up(){
    limit=5;
    page=1;
    count=0;
    offset=0;
    total_pages=0;
    people=null;
    if (localStorage.people)
    {
        people=JSON.parse(localStorage.people);
        count=people.length;
    }
    else
    {
        people=[["Haris H","hari","hari.bih@gmail.com","123456"],
            ["Dino Haracic","dino","dino@gmail.com","passssss"],
            ["Damir Hamidovic","damir","damir@gmail.com","asdfasdf"],
            ["Edna Debic","edna","edna@gmail.com","qwerertrt"],
            ["Dario Osmanovic","dario","dario@yahoo.com","dfhgfhdf"],
            ["Dino Bosnjakovic","dinob","bosnjakovic@yahoo.net","fhrth"],
            ["Samid Latifovic","same","samid@gmail.net","dfhgfbgh"],
            ["Edin Alibegovic","edin","edin@gmail.com","dbsrgergt"],
            ["Alen Helac","alen","alen@yahoo.com","qwerertrt"]];
        localStorage.people=JSON.stringify(people);
        count=people.length;
    }
    set_global(1,count);

    create_table_page();
    create_search();
    load_find_data();
}

set_up();
