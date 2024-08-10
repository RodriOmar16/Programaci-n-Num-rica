
public class main {

	public static void main(String[] args) {
		Polinomio p = new Polinomio(3);
		
		p.cargarArray();
		//p.cargarArrayLagrange();
		p.construirExpresion();
		p.mostrarCoef();
		System.out.println();
		
		/*double a = 1,  c[] = new double[p.getCantTerminos()];
		System.out.println("P("+a+") = "+p.evaluarPolinomio(a));
		c = p.hornerSimpleCaso1(a);
		mostrarCoefHorner(c, 1, p.getCantTerminos());
		System.out.println("P("+a+") = "+c[0]);*/
		
		/*double a = 5, b=-2,  c[] = new double[p.getCantTerminos()];
		c = p.hornerSimpleCaso2(a,b);
		mostrarCoefHorner(c, 1, p.getCantTerminos());
		System.out.println("P("+a+") = "+c[0]);*/
		
		/*double c[] = p.hornerDobleCaso1(-2.5, 7);
		mostrarCoefHorner(c,2,p.getCantTerminos());
		System.out.println("R(x) = "+c[1]+"x "+(c[0] > 0? "+"+c[0] : c[0] ));*/
		
		/*double r = p.newtonPolinomios(1, 0.0001);
		System.out.println("Raiz aproximada: "+r);*/
		
		/*p.detEnteras();
		int n = p.getCantEnteras();
		if(n > 0) mostrarArray(p.getRaicesEnteras(), n);  
		else System.out.println("No admite raíces enteras.");*/
		
		/*p.detRacionales();
		double[] r = p.getRaicesRacionales();
		int n = p.getCantRacionales();
		if(n > 0) {
			mostrarArray(r,n);
		}else System.out.println("No admite raíces racionales.");*/
		
		//mostrarArray(p.getCoef(), p.getCantTerminos());
		
		/*double cotas[] = new double [2];
		cotas = p.detCotas(3, 4);
		System.out.println("cotas[3]: "+cotas[3]);
		System.out.println("cotas[2]: "+cotas[2]);
		System.out.println("cotas[1]: "+cotas[1]);
		System.out.println("cotas[0]: "+cotas[0]);*/
		
		double epsilon = 0.00001, r = 2, s = -2; int max = 10000;
		p.bairstow(epsilon, r, s, max);
		
	}
	
	private static void mostrarArray(double[]v, int n) {
		for(int i = 0 ; i<n ; i++) {
			System.out.println("v["+i+"]: "+v[i]);
		}
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
