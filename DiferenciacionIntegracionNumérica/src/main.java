import Metodos.Funcion;

public class main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Funcion f = new Funcion();
		f.setFuncion("atan(x)");
		/*System.out.println("funcion: "+f.getFuncion());
		f.evaluar(1.15);
		System.out.println("f("+0+"): "+f.getResultadoFuncion());*/
		//System.out.println("f'(x) aprox.: "+derivadaProgresiva(f, 0.6, 0.1));
		double x0 = 1.4142135623731, h = 0.2; int m = 2;
		System.out.println("La derivada por Richardson: "+richardson(f, x0, h, m));
	}
	
	public static double derivadaProgresiva(Funcion f,double x0, double h) {
		double fx0 = f.evaluar2(x0), fx0h = f.evaluar2(x0 + h);
		return ((fx0h - fx0)/h);
	}
	public static double derivadaRegresiva(Funcion f,double x0, double h) {
		double fx0 = f.evaluar2(x0), fx0h = f.evaluar2(x0 + h);
		return ((fx0 - fx0h)/h);
	}
	public static double derivadaCentrada(Funcion f,double x0, double h) {
		double fx0hN = f.evaluar2(x0 - h), fx0h = f.evaluar2(x0 + h);
		return ((fx0h - fx0hN)/(2*h));
	}
	public static double richardson(Funcion f, double x0, double h, int m) {
		double D[][] = new double[m+1][m+1];
		
		D[0][0] = derivadaCentrada(f,x0,h);
		for(int n=1; n<=m ;n++) {
			D[n][0] = derivadaCentrada(f,x0, (h/Math.pow(2, n)));
			
			for(int k=1; k<=n ;k++) {
				D[n][k] = D[n][k-1] + (D[n][k-1] - D[n-1][k-1])/((Math.pow(4, k))-1);
			}
		}
		return D[m][m];
	}
	
}
