
public class Main {

	public static void main(String[] args) {
		Matriz a = new Matriz(4,4);
		a.cargarMatriz();
		a.mostrarMatriz(3);
		
		//-----------------------------------------
		int orden[] = new int[2]; 
		orden = a.getOrden();

		if(orden[0] == orden[1]) {
			double det = a.detMatriz(2);
			//System.out.println("det: "+ det);
			if(det != 0) {
				double x[] = new double[orden[0]];
				//x = a.resolucionSistDiagonal();
				//x = a.resolucionSistTriangularSuperior(a.getMatrizCoef(),orden[0],a.getMatrizTermIndep());
				//x = a.resolucionSistTriangularInferior(a.getMatrizCoef(),orden[0],a.getMatrizTermIndep());
				//mostrarResultado(x, orden[0]);
				
				//a.factorizacionLU();
				//a.factorizacionLUgauss();
				/*System.out.println("\nMatriz L: ");
				mostrarMatriz(a.getL(),orden[0], orden[0]);
				System.out.println("\nMatriz U: ");
				mostrarMatriz(a.getU(),orden[0], orden[0]);*/
				
				/*x = a.eliminacionGaussiana();
				mostrarResultado(x, orden[0]);*/
				/*x = a.gaussJordan();
				mostrarResultado(x, orden[0]);*/
				x = a.croutL1U();
				mostrarResultado(x, orden[0]);
				
			}else System.out.println("La matriz de coeficiente no es inversible(Determinante <> 0). No es posible continuar");
		}else {
			System.out.println("\nLa matriz no es cuadrada, no es posible calcular el Determinante.");
		}
		
	}
	
	public static void mostrarMatriz(double a[][], int n, int m) {
		for(int f=0; f<n ;f++) {
			System.out.println("");
			for(int c=0; c<m ;c++) {
				System.out.print(a[f][c]+"\t");
			}
		}
	}
	public static void mostrarResultado(double b[], int n) {
		System.out.println("\nMestra resultado x[]:");
		for(int c=0; c<n ;c++) {
			System.out.print(b[c]+"\t");
		}
	}
	public static void mostrarSistema(double a[][], int n, int m, double b[], int tam) {
		for(int f=0; f<n ;f++) {
			System.out.println("");
			for(int c=0; c<m ;c++) {
				System.out.print(a[f][c]+"\t");
			}
			System.out.println(" | "+b[f]);
		}
	}

}
