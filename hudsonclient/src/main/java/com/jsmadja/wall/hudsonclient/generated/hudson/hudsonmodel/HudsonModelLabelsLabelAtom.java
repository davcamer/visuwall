//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.1.10 in JDK 6 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2011.02.21 at 12:25:24 PM CET 
//


package com.jsmadja.wall.hudsonclient.generated.hudson.hudsonmodel;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for hudson.model.labels.LabelAtom complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="hudson.model.labels.LabelAtom">
 *   &lt;complexContent>
 *     &lt;extension base="{}hudson.model.Label">
 *       &lt;sequence>
 *         &lt;element name="propertiesList" type="{}hudson.model.labels.LabelAtomProperty" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "hudson.model.labels.LabelAtom", propOrder = {
    "propertiesList"
})
public class HudsonModelLabelsLabelAtom
    extends HudsonModelLabel
{

    protected List<HudsonModelLabelsLabelAtomProperty> propertiesList;

    /**
     * Gets the value of the propertiesList property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the propertiesList property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPropertiesList().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link HudsonModelLabelsLabelAtomProperty }
     * 
     * 
     */
    public List<HudsonModelLabelsLabelAtomProperty> getPropertiesList() {
        if (propertiesList == null) {
            propertiesList = new ArrayList<HudsonModelLabelsLabelAtomProperty>();
        }
        return this.propertiesList;
    }

}
