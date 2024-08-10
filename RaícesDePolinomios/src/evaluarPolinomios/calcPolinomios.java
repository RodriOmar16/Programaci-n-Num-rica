package evaluarPolinomios;

import java.util.Scanner;

public class calcPolinomios {
    //private int[] enteras= new int[200];
        
    public static void main(String[] args) {
        int grado = 3, n = grado+1;
        double[] coef = new double[n];
        double a = 2, b = -5, c = 7;
        cargarArray(coef,n);
        System.out.println();
        mostrarCoef(coef, n);
        
        //--------------------------------------------------------
        /*a *= -1;
        System.out.println("Valor a evaluaro: "+a);
        double[] c = hornerSimpleCaso1(coef, a, n);
        mostrarCoefHorner(c,1,n);
        System.out.println("\nHorner simple Caso 1: "+c[0]);*/
        //---------------------------------------------------------
        /*double[] c = hornerSimpleCaso2(coef, a, b, n);
        mostrarCoefHorner(c,1, n); 
        System.out.println("\nHorner simple Caso 2: "+c[0]);*/
        //----------------------------------------------------------
        /*double[] cociente = hornerDobleCaso1(coef, a, b, n);
        mostrarCoefHorner(cociente,2, n);
        System.out.println("\nHorner doble Caso 1: "+ cociente[1]+", "+cociente[0]);*/
        //----------------------------------------------------------
        /*double[] cociente = hornerDobleCaso2(coef, a, b, c, n);
        mostrarCoefHorner(cociente, 2, n);
        System.out.println("\nHorner doble Caso 1: "+ cociente[1]+", "+cociente[0]);*/
        //----------------------------------------------------------
        /*double xn1 = newtonPolinomios(coef, 1, 0.0001, n);
        System.out.println("\nNewton para polinomio: "+ xn1);*/
        //----------------------------------------------------------
        /*int cantEnterasPosibles = detCantEnteras(coef,n) * 2;
         System.out.println("cantEnterasPosibles: "+cantEnterasPosibles);
        double[] raicesEnteras = new double[cantEnterasPosibles];
        raicesEnteras = detRaicesEnteras(coef,n,cantEnterasPosibles)*/
    }
    
    private static double[] detRaicesEnteras(double[] coef, int n, int m){
        double[] r = new double[m];
        return r;
    }
    
    private static int detCantEnteras(double[] coef, int n){
        int c = 0;
        double nro = coef[0];
        if(nro != 0){
            if(nro == 1) return 1;
            else{
                if(nro==2 || nro==3 || nro==5 || nro==7){
                    return 2;
                }else{
                    int d = 1;
                    double max = nro/2;
                    c = 1;
                    while(d <= max){
                        if(nro%d == 0){
                            c++;
                        }
                        d++;
                    }
                }
            }
        }
        return c;
    }
    
    private static double newtonPolinomios(double[] coef, double xn1, double epsilon, int n) {
    double xn;
    double[] dpP = new double[2]; 
      do {
        xn = xn1;
        dpP = newtonHorner(coef, n, xn1);
        xn1 = xn - (dpP[0]/dpP[1]);
      }while(Math.abs(xn1 - xn) > epsilon);
      
    return xn1;
  }

  private static double[] newtonHorner(double[] coef, int n, double a) {
    double[] nh = new double[2];
    double dp = 0, p = coef[n-1];
    int i;
    for(i = (n-2); i>=0 ;i--) {
      dp = a*dp + p;
      p = p*a + coef[i];
    }
    nh[0] = p;
    nh[1] = dp;
    
    return nh;
  }

  private static double[] hornerDobleCaso2(double[] coef, double a, double b, double c, int n) {
      b/=a;
    c/=a;
    coef = hornerDobleCaso1(coef, b, c, n);
    mostrarCoefHorner(coef, 2, n );
    for(int i = (n-1); i>1 ;i--){
      coef[i] /= a;
    }
    return coef;
  }

  private static double[] hornerDobleCaso1(double[] coef, double a, double b, int n) {
      double[] c = new double[n];
      a *=-1;      b *=-1;
      c[n-1] = coef[n-1];
      c[n-2] = a*c[n-1] + coef[n-2];
      int i;
      
      for(i=(n-3); i>0 ;i--) {
        c[i] = coef[i] + a*c[i+1] + b*c[i+2];
      }
      c[0] = coef[0] + b*c[2];
    return c;
  }

private static double[] hornerSimpleCaso2(double[] coef, double a, double b, int n) {
      double[] c = new double[n];
      
      b = b/a;
      c = hornerSimpleCaso1(coef,-1*b,n);
      for(int i = (n-1); i>=1 ;i--) {
        c[i] /= a;
      }
      
    return c;
  }
    public static double[] hornerSimpleCaso1(double[] coef, double a, int n) {
      double[] c = new double[n];
    
    c[n-1] = coef[n-1];    
    for(int i=n-2;i >= 0;i--) {
      c[i] = a*c[i+1] + coef[i];
    }
    
    return c;
  }
    
  private static void cargarArray(double[] c, int n){
        Scanner teclado = new Scanner(System.in);
        int i = n-1;
          
        for(i=(n-1);i>0;i--){
            if(i != (n-1)){
                System.out.print("Ingresar coeficiente para el exponente "+i+": ");
                c[i] = teclado.nextDouble();
            }else {
                do{
                    System.out.print("Ingresar coeficiente para el exponente "+i+": ");
                    c[i] = teclado.nextDouble();
                }while(c[i] == 0);
            }
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
    }
    
  private static void mostrarCoefHorner(double[] c,int a, int n){
        String cad = "";
        int i;
        int e = (n-1) - a;
        for(i=(n-1);i>=a;i--){
            if(c[i] >= 0){
                if(i!=(n-1)){
                    cad += "+";
                }
            }
            if(e==0){
                cad = cad + " "+ c[i];
            }else{
                if(e==1){
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
                        cad += " x^"+e+" ";
                    }else{
                        if(c[i] == -1){
                            cad += "- x^"+e+" ";
                        }
                        else cad = cad +" "+ c[i] + "x^"+e+" ";
                    }
                }
            }
            e--;
        }
        System.out.println("P(x) = "+cad);
    }

}