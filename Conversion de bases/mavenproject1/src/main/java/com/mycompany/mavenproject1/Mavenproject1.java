/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.mavenproject1;
/**
 *
 * @author Admin
 */
public class Mavenproject1 {

    public static void main(String[] args) {
        int basePartida = 10, baseLlegada = 8; //base distinta de 10
        String nro = "1.5";
        if(basePartida != baseLlegada){
            if(controlarNro(basePartida, nro)){
                //System.out.println("todos sus digitos son menores a su base.");
                String nroEquivalente = "";
                int metodo = 3;
                switch(metodo){
                    //METODOS PARA LLEGAR A BASE 10
                    case 1 -> nroEquivalente = sumaPonderada(nro, basePartida);
                    case 2 -> nroEquivalente = sumaPonderadaConDecimales(nro, basePartida);
                    //METODOS PARA PARTIR DE BASE 10
                    case 3 -> nroEquivalente = multiplicacionReiterada(nro, baseLlegada);
                    case 4 -> nroEquivalente = divisionReiterada(nro, baseLlegada);
                    //METODO DIRECTO
                    case 5 -> nroEquivalente = metodoDirecto(nro, basePartida, baseLlegada);
                }
                System.out.println("El nro en base "+baseLlegada+" es: " + nroEquivalente);
            }else System.out.println("Existe algun digito que es mayor o igual a su base.");
        }
    }

    private static boolean validarCaracterBase(int basePartida, char caracter){
        if(Character.isDigit(caracter)){
            return 0 <= Character.getNumericValue(caracter) && Character.getNumericValue(caracter) < basePartida ;
        }else{
            switch(basePartida){
                case 11 -> {
                    return caracter == 'A';
                }
                case 12 -> {
                    return caracter == 'A' || caracter == 'B';
                }
                case 13 -> {
                    return caracter == 'A' || caracter == 'B' || caracter == 'C';
                }
                case 14 -> {
                    return caracter == 'A' || caracter == 'B' || caracter == 'C'  || caracter == 'D';
                }
                case 15 -> {
                    return caracter == 'A' || caracter == 'B' || caracter == 'C'  || caracter == 'D' || caracter == 'E';
                }
                case 16 -> {
                    return caracter == 'A' || caracter == 'B' || caracter == 'C'  || caracter == 'D' || caracter == 'E' || caracter == 'F';
                }
            } 
            System.out.println("LLEGO HASTA AQUÍ");
            return false;
        }
    }
    private static boolean controlarNro(int basePartida, String nro) {
        int n = nro.length();
        int i=0, j=0;
        boolean cumple = true;
        while(i < n && cumple){
            //SI ES EL PUNTO DECIMAL (.) LO IGNORA
            if(nro.charAt(i)!='.'){
                if(basePartida <= 10){
                    if(Character.getNumericValue(nro.charAt(i)) < 0 || 
                         basePartida <= Character.getNumericValue(nro.charAt(i))){
                      cumple = false;
                     }
                }else{ // Bases de a 11 a 16
                    if( validarCaracterBase(basePartida, nro.charAt(i)) == false){
                      cumple = false;
                    }
                }
            } 
            //
            i++;
        }
        return cumple;
    }

    private static String sumaPonderada(String nro, int base) {
        int expo = 0;
        int nroNvo;
        int acu = 0;
        for(int i=nro.length()-1;i >= 0 ;i--){
            nroNvo = Character.getNumericValue(nro.charAt(i));
            acu += nroNvo * Math.pow(base, expo);
            expo++;
        }
        return acu+"";
    }

    private static String sumaPonderadaConDecimales(String nro, int base) {
        String[] nroPartes = nro.split("\\.");
        String nroParteEntera = nroPartes[0],
        nroParteDecimal = nroPartes[1];
        
        //Convierte parte entera
        int expo = 0;
        int nroNvo;
        int acu = 0;
        for(int i=nroParteEntera.length()-1;i >= 0 ;i--){
            nroNvo = Character.getNumericValue(nroParteEntera.charAt(i));
            acu += nroNvo * Math.pow(base, expo);
            expo++;
        }
        //nroResultado = acu + ".";
        
        //Convierte parte decimal
        expo = -1;
        double acuD = 0;
        for(int i=0;i < nroParteDecimal.length();i++){
            nroNvo = Character.getNumericValue(nroParteDecimal.charAt(i));
            acuD += nroNvo * Math.pow(base, expo);
            expo--;
        }
        acuD += acu;
        return acuD + "";
    }

    private static String invertirString(String str) {
        String nva = "";
        for(int i=str.length()-1; i>=0 ;i--){
           nva += str.charAt(i);
        }
        return nva;
    }
    private static String divisionReiterada(String nro, int baseLlegada) {
        String str = "";
        int nroCompleto = Integer.parseInt(nro);
        while(nroCompleto != 0){
            str += nroCompleto % baseLlegada;
            nroCompleto /= baseLlegada; 
        }
        return invertirString(str);
    }

    private static String metodoDirecto(String nro, int basePartida, int baseLlegada) {
        String str = "";
        int dig = 1;
        if(basePartida == baseLlegada){
            return nro;
        }
        if(basePartida > baseLlegada){
            while(Math.pow(baseLlegada, dig) < basePartida && dig < 4){
                dig++;
            }
        }else{
            while(Math.pow(basePartida, dig) < baseLlegada && dig < 4){
                dig++;
            }
        }
        //METODO AQUÍ 
        
        return str;
    }  

    private static String convertirDig(int dig, int baseLlegada) {
        if(dig < baseLlegada){
            return dig + "";
        }else{
            //if(dig == baseLlegada){
                return divisionReiterada(dig + "", baseLlegada);
            //}
           //return "";
        }
    }
    private static String multiplicacionReiterada(String nro, int baseLlegada) {
        float nroCompleto = Float.parseFloat(nro);
        int nroParteEntera = (int) nroCompleto, 
            t = 9;
        float nroParteDecimal = nroCompleto - nroParteEntera;
        
        String strNroParteEntera = divisionReiterada(nroParteEntera + "", baseLlegada),
               strNroNvo = "";
        if(strNroParteEntera.equals("")){
            strNroParteEntera = "0";
        }
        //if(baseLlegada < 10){ //SUPONE QUE LA BASE DE PARTIDA SIEMPRE 10
            while(t >= 0){
                nroParteDecimal *= baseLlegada;
                strNroNvo += convertirDig((int)nroParteDecimal, baseLlegada); 
                t--;
                nroParteDecimal -= (int)nroParteDecimal;
            }
        //}
        return strNroParteEntera+"."+strNroNvo;
    }
}
