export default class FlowchartUtil  {

    // blockId: block_xyz_block
    // frame: block_xyz_frame
    // text: block_xyz_text
    // rect: block_xyz_rect
    // port: abc  : block_xyz_port_abc_port
    // port: abc port knob : block_xyz_port_abc_knob
    // port: abc port text : block_xyz_port_abc_text

    public static readonly FLD_DELIM = "|";
    public static readonly MAX_BLOCKS=300;
    public static readonly MAX_PORTS_PER_BLOCK=30;


    public static extractTag(e: React.BaseSyntheticEvent, tagname: string) {
        const strid: string = (e.target as any).id;
        return FlowchartUtil.extractTagFromStr(strid, tagname);
    }

    protected static extractTagFromStr(strid: string, tagname: string) {
        const pattern=tagname+FlowchartUtil.FLD_DELIM;
        let ndx = strid.indexOf(pattern);
        if(ndx<0) {
           return undefined;
        }
        const start = ndx+pattern.length;
        ndx = strid.indexOf(FlowchartUtil.FLD_DELIM, start);
        const tag = strid.substring(start, ndx);
        if(tag && tag.length>0) {
          return tag;
        }
        return undefined;
    }

}
