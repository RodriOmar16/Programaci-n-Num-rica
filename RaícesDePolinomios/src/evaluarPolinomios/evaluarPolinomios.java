package evaluarPolinomios;

import java.util.Scanner;

public class evaluarPolinomios {
    
    public static void main(String[] args) {
        int grado = 3, n = grado+1;
        double[] coef = new double[n];
            double a = 1;
        System.out.println("a: "+a);
        cargarArray(coef,n);
        mostrarCoef(coef,n);     
        double evaluado = evaluarPolinomio(coef, a, n);
        System.out.println("P(a) = "+evaluado); 
    }
    private static void cargarArray(double[] c, int n){
        System.out.println("elementos de coef: "+n+"\ngrado: "+(n-1));
        Scanner teclado = new Scanner(System.in);
        int i;
        for(i=(n-1);i>0;i--){
            System.out.print("Ingresar coeficiente para el exponente "+i+": ");
            c[i] = teclado.nextDouble();
        }
        System.out.print("Ingresar coeficiente para del término independiente: ");
        c[i] = teclado.nextDouble();
    }
    private static void mostrarCoef(double[] c, int n){
        String cad = "";
        int i;
        for(i=(n-1);i>=0;i--){
            if(c[i] >= 0){
                if(i!=(n-1)){
                    cad += "+";
                }
            }
            if(i==0){
                cad = cad + " "+ c[i];
            }else{
                if(i==1){
                    if(c[i] == 1){
                        cad += " x ";
                    }else{
                        if(c[i] == -1){
                            cad += "- x ";
                        }
                        else {
                        	cad = cad + " " + c[i] + "x ";
                        }
                    }
                }else{
                    if(c[i] == 1){
                        cad += " x^"+i+" ";
                    }else{
                        if(c[i] == -1){
                            cad += "- x^"+i+" ";
                        }
                        else cad = cad +" "+ c[i] + "x^"+i+" ";
                    }
                }
            }
        }
        System.out.println("P(x) = "+cad);
            
        /*System.out.println("--------------------");
        
        for(i=0;i<n;i++){
            if(i==0){
                System.out.println("coeficiente para el ter. indep. "+i+": "+c[0]);
            }else System.out.println("coeficiente para el exponente "+i+": "+c[i]);
        }*/

    }
    
    private static double evaluarPolinomio(double[] coef, double a, int n){
        double p = 0;
        for(int i=n-1;i>=0;i--){
            p = p*a + coef[i];
        }
        return p;
    }
}