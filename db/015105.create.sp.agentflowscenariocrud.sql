call TRACE('create SP AgentScenarioCRUDJSON');

create or replace procedure AgentScenarioCRUDJSON()
as $$
declare
_js JSONB;
begin

call CRUDFunctionsCreate('agentscenario');


select * from StandardEPageAddJSON('agentscenario', 'Agent Scenarios', 'name/Name/text', 'name/Name/text/general, flow/Flow/flowchart/flow', testsession2(), '{"editpage": {"actions": { "all":{"location":"top"} } } }' ) into _js;


end
$$
language plpgsql;


call AgentScenarioCRUDJSON();

