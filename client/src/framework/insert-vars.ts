export default function insertVars(str: string, vars: any) {
    console.log("insertVars str="+str+" vars=");
    console.dir(vars);
    while(true) {
        const ndx1 = str.indexOf("${");
        if(ndx1<0) {
            return str;
        }
        const ndx2 = str.indexOf("}", ndx1+1);
        if(ndx1<0) {
            return str;
        }
        const varname = str.substr(ndx1+2, ndx2-ndx1-2);
        const value = (vars[varname] || "");
        console.log("ndx1="+ndx1+" ndx2="+ndx2+" varname="+varname+" value="+value);
        str = str.substr(0,ndx1) + value + str.substr(ndx2+1);
    }
}