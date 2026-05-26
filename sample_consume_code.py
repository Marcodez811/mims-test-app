import requests
import base64
from concurrent.futures import ThreadPoolExecutor
import sys
import lxml.etree as ET

def consume_endpoint(endpoint, prescription_query, resp_type, alert_filter_by_drug, alert_filter_by_severity):
    form_data_map = {}

    # Logic to populate map based on parameters (mimicking Java logic)
    # 2 parameters (prescriptionquery, responsetype)
    if alert_filter_by_drug == "" and alert_filter_by_severity == "":
        form_data_map["prescriptionquery"] = prescription_query
        form_data_map["responsetype"] = resp_type
    
    # 4 parameters (prescriptionquery, responsetype, alertfilterbyseverity, alertfilterbydrug)
    elif alert_filter_by_drug != "" and alert_filter_by_severity != "":
        form_data_map["prescriptionquery"] = prescription_query
        form_data_map["responsetype"] = resp_type
        form_data_map["alertfilterbydrug"] = alert_filter_by_drug
        form_data_map["alertfilterbyseverity"] = alert_filter_by_severity
        
    # 3 parameters (prescriptionquery, responsetype, alertfilterbydrug)
    elif alert_filter_by_drug != "" and alert_filter_by_severity == "":
        form_data_map["prescriptionquery"] = prescription_query
        form_data_map["responsetype"] = resp_type
        form_data_map["alertfilterbydrug"] = alert_filter_by_drug
        
    # 3 parameters (prescriptionquery, responsetype, alertfilterbyseverity)
    elif alert_filter_by_drug == "" and alert_filter_by_severity != "":
        form_data_map["prescriptionquery"] = prescription_query
        form_data_map["responsetype"] = resp_type
        form_data_map["alertfilterbyseverity"] = alert_filter_by_severity

    # Basic Authorization
    name = "Flyshet"
    password = "OcTpwTfR4PT"
    auth_string = f"{name}:{password}"
    auth_bytes = auth_string.encode('ascii')
    auth_string_enc = base64.b64encode(auth_bytes).decode('ascii')

    headers = {
        "Authorization": f"Basic {auth_string_enc}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(endpoint, data=form_data_map, headers=headers)
        
        if response.status_code != 200:
            print("Unable to connect to the server", file=sys.stderr)
            
        return response.text
    except Exception as e:
        print(f"Error during request: {e}")
        return None

def transform_xml_to_html(xml_content, xslt_path):
    try:
        # Parse XML content
        dom = ET.fromstring(xml_content.encode('utf-8'))
        # Parse XSLT file
        xslt = ET.parse(xslt_path)
        transform = ET.XSLT(xslt)
        # Transform XML
        newdom = transform(dom)
        return str(newdom)
    except Exception as e:
        print(f"Error during transformation: {e}", file=sys.stderr)
        return None

def main():
    # FT Web service URL
    endpoint = "http://49.249.193.198:8081/RESTFTWebService/FTRequest/xmlrequestplus"

    # "prescriptionquery" is a mandatory paramerter

    prescription_query = (
        "<Request>\r\n"
        "<Interaction>\r\n"
        "<Prescribing>\r\n"
        '<GenericItem reference="{B43550AD-945E-461B-E034-080020E1DD8C}">\r\n'
        '<RouteOfAdministration name="Oral" />\r\n'
        "<Dosing>\r\n"
        "<Dose>\r\n"
        "<Value>3000</Value>\r\n"
        "<Unit>mcg</Unit>\r\n"
        "</Dose>\r\n"
        "<Frequency><Hour>24</Hour></Frequency>\r\n"
        "<Duration>\r\n"
        "<Day>2</Day>\r\n"
        "</Duration>\r\n"
        "<Indications>\r\n"
        '<Indication name="Treatment for gout attack" />\r\n'
        "</Indications>\r\n"
        "</Dosing>\r\n"
        "</GenericItem>\r\n"
        "</Prescribing>\r\n"
        "<References />\r\n"
        "</Interaction>\r\n"
        "<PatientProfile>\r\n"
        "<Gender>F</Gender>\r\n"
        "<Age>\r\n"
        "<Year>40</Year>\r\n"
        "</Age>\r\n"
        "<Weight>60</Weight>\r\n"
        "</PatientProfile>\r\n"
        "</Request>"
    )

    # "alertfilterbydrug" is an optional paramerter

    # alert_filter_by_drug = (
    #     "<GUIDS>\r\n"
    #     "<GUID>{3FF1C83E-9426-4095-9CF7-48EFE86E2F5C}</GUID>\r\n"
    #     "<GUID>{D547BD9C-F142-4AF1-9361-A46821E43068}</GUID>\r\n"
    #     "</GUIDS>"
    # )

    # "alertfilterbyseverity" is an optional parameter

    # alert_filter_by_severity = (
    #     "<WARNINGIDS>\r\n"
    #     "<WARNINGID>DP:X</WARNINGID>\r\n"
    #     "<WARNINGID>DP:A</WARNINGID>\r\n"
    #     "<WARNINGID>DP:B</WARNINGID>\r\n"
    #     "<WARNINGID>DP:C</WARNINGID>\r\n"
    #     "<WARNINGID>DL:Caution</WARNINGID>\r\n"
    #     "<WARNINGID>DI:1</WARNINGID>\r\n"
    #     "<WARNINGID>DT:1</WARNINGID>\r\n"
    #     "<WARNINGID>DT:2</WARNINGID>\r\n"
    #     "<WARNINGID>DT:3</WARNINGID>\r\n"
    #     "<WARNINGID>D2H:Contraindicated</WARNINGID>\r\n"
    #     "<WARNINGID>D2H:Extreme Caution</WARNINGID>\r\n"
    #     "<WARNINGID>D2D:Severe</WARNINGID>\r\n"
    #     "<WARNINGID>D2D:Minor</WARNINGID>\r\n"
    #     "<WARNINGID>D2D:Caution</WARNINGID>\r\n"
    #     "<WARNINGID>WOCBA:X</WARNINGID>\r\n"
    #     "<WARNINGID>WOCBA:A</WARNINGID>\r\n"
    #     "<WARNINGID>WOCBA:B</WARNINGID>\r\n"
    #     "<WARNINGID>WOCBA:C</WARNINGID>\r\n"
    #     "</WARNINGIDS>"
    # )

    # "responsetype" is a mandatory parameter
    response_type = "xml"

    def run_task():
        # 2 parameters (prescriptionquery, responsetype)
        response_xml = consume_endpoint(endpoint, prescription_query, response_type, "", "")
        
        # 3 parameters (prescriptionquery, responsetype, alertfilterbydrug)
        # response_xml = consume_endpoint(endpoint, prescription_query, response_type, alert_filter_by_drug, "")

        # 3 parameters (prescriptionquery, responsetype, alertfilterbyseverity)
        # response_xml = consume_endpoint(endpoint, prescription_query, response_type, "", alert_filter_by_severity)
        
        # 4 parameters (prescriptionquery, responsetype, alertfilterbyseverity, alertfilterbydrug)
        # response_xml = consume_endpoint(endpoint, prescription_query, response_type, alert_filter_by_drug, alert_filter_by_severity)
        
        if response_xml:
            print("XML Response received. Transforming to HTML...")
            xslt_path = "MIMSStylesheet_CDSDefault_byRanking_EN_551126.xsl"
            html_content = transform_xml_to_html(response_xml, xslt_path)
            
            if html_content:
                print("Transformation successful.")
                # Verify calling it working html code by saving it
                with open("output.html", "w", encoding='utf-8') as f:
                    f.write(html_content)
                print("HTML content saved to output.html")
            else:
                print("Transformation failed.")

    with ThreadPoolExecutor() as executor:
        future = executor.submit(run_task)
        try:
            future.result()
        except Exception as e:
            print(f"Error in thread: {e}")

if __name__ == "__main__":
    main()
